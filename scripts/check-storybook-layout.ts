// Explicit browser review tool, not a runtime or CI dependency.
// Build Storybook, serve storybook-static, then:
// bun scripts/check-storybook-layout.ts http://127.0.0.1:6006 [artifact-directory]
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const origin = new URL(process.argv[2] ?? "http://127.0.0.1:6006");
const directory = resolve(process.argv[3] ?? ".local/storybook-layout");
const session = `runway-layout-${process.pid}`;
const index = await fetch(new URL("index.json", origin));
assert.ok(index.ok, "Serve a built Storybook with index.json before running this check.");
const stories = Object.values(
  (await index.json()).entries as Record<
    string,
    { type: string; id: string; title: string; name: string }
  >,
).filter((e) => e.type === "story");
assert.ok(stories.length, "No stories were discovered.");
await mkdir(directory, { recursive: true });
const results = [];
async function browser(...args) {
  const { stdout } = await run("agent-browser", ["--session", session, "--json", ...args], {
    timeout: 45_000,
    maxBuffer: 2 ** 20,
  });
  const response = JSON.parse(stdout);
  assert.equal(response.success, true, JSON.stringify(response.error));
  return response.data;
}
try {
  for (const [width, height] of [
    [320, 740],
    [390, 844],
    [1366, 768],
    [1440, 900],
  ]) {
    await browser("set", "viewport", String(width), String(height));
    for (const { id } of stories) {
      const url = new URL("iframe.html", origin);
      url.searchParams.set("id", id);
      url.searchParams.set("viewMode", "story");
      await browser("open", url.href);
      await browser("wait", ".story-surface");
      const { result } = await browser(
        "eval",
        `(async () => {
        await document.fonts.ready;
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        await Promise.all(document.getAnimations()
          .filter(a => Number.isFinite(a.effect?.getComputedTiming().endTime))
          .map(a => a.finished.catch(() => {})));
        const visible = e => e.getBoundingClientRect().height > 0;
        return {
          rendered: !!document.querySelector('.story-surface'),
          pageWidth: document.documentElement.scrollWidth,
          errors: [...document.querySelectorAll('.sb-errordisplay,.sb-nopreview')]
            .filter(visible).map(e => e.textContent.trim()),
          isolated: [...document.querySelectorAll('.story-surface iframe')].map(f => ({
            title: f.title,
            width: f.contentDocument.documentElement.clientWidth,
            scrollWidth: f.contentDocument.documentElement.scrollWidth,
            verified: f.dataset.verified
          })),
          scrollRegions: [...document.querySelectorAll('.story-scroll')].map(e => ({
            name: e.getAttribute('aria-label'),
            keyboard: e.tabIndex === 0,
            contained: e.scrollWidth > e.clientWidth
          })),
          unsupported: !![...document.querySelectorAll('.rw-observatory__unsupported')]
            .find(visible)
        };
      })()`,
      );
      results.push({ id, width, height, ...result });
      await browser("screenshot", resolve(directory, `${width}-${id}.png`), "--full");
      assert.equal(result.rendered, true, `${id}: missing story`);
      if (id.includes("simulation-observatory")) {
        const { result: workspaceVisible } = await browser(
          "eval",
          `(() => {
          const workspace = document.querySelector('.rw-observatory__workspace');
          return !!workspace && workspace.getBoundingClientRect().height > 0;
        })()`,
        );
        assert.equal(workspaceVisible, true, `${id}: responsive workspace is hidden`);
        assert.equal(
          result.unsupported,
          false,
          `${id}: a desktop-only gate replaced the workspace`,
        );
      }
      assert.deepEqual(result.errors, [], `${id}: Storybook render error`);
      assert.ok(
        result.pageWidth <= width + 1,
        `${width}px ${id}: page overflows to ${result.pageWidth}px`,
      );
      for (const frame of result.isolated) {
        assert.ok(frame.scrollWidth <= frame.width + 1, `${id}: isolated document overflows`);
        assert.equal(frame.verified, "true", `${id}: isolation play checks did not complete`);
      }
      for (const region of result.scrollRegions)
        assert.ok(region.name && region.keyboard, `${id}: unnamed or unfocusable scroll region`);
    }
    console.log(`${width}px: ${stories.length} stories rendered without page overflow.`);
  }
  for (const [width, height] of [
    [320, 740],
    [390, 844],
    [1366, 768],
    [1440, 900],
  ]) {
    await browser("set", "viewport", String(width), String(height));
    for (const variant of ["playground", "compact-actions", "long-content", "required-decision"]) {
      const url = new URL("iframe.html", origin);
      url.searchParams.set("id", `foundations-dialog--${variant}`);
      url.searchParams.set("viewMode", "story");
      await browser("open", url.href);
      await browser("wait", ".story-surface");
      await browser("snapshot", "-i");
      await browser("click", 'button[command="show-modal"]');
      const { result } = await browser(
        "eval",
        `(async () => {
        const dialog = document.querySelector('dialog');
        await Promise.all(dialog.getAnimations().map(a => a.finished.catch(() => {})));
        const rect = dialog.getBoundingClientRect();
        return { open: dialog.open, withinViewport: rect.top >= 0 && rect.bottom <= innerHeight,
          actionsVisible: [...dialog.querySelectorAll('button')].every(b => {
            const r = b.getBoundingClientRect();
            return r.top >= rect.top && r.bottom <= rect.bottom && r.left >= rect.left && r.right <= rect.right;
          }), initialFocus: document.activeElement.value };
      })()`,
      );
      results.push({ id: `dialog-open-${variant}`, width, ...result });
      await browser("screenshot", resolve(directory, `${width}-dialog-open-${variant}.png`));
      assert.ok(
        result.open && result.withinViewport && result.actionsVisible,
        `${width}px ${variant}: dialog actions are outside the visible surface`,
      );
      assert.equal(result.initialFocus, "cancel", `${variant}: initial safe focus changed`);
      await browser("press", "Escape");
      if (variant === "required-decision") {
        assert.equal((await browser("eval", "document.querySelector('dialog').open")).result, true);
        await browser("snapshot", "-i");
        await browser("click", 'button[value="cancel"]');
      }
      const { result: closed } = await browser(
        "eval",
        `({
        closed: !document.querySelector('dialog').open,
        restored: document.activeElement.matches('button[command="show-modal"]')
      })`,
      );
      assert.ok(closed.closed && closed.restored, `${variant}: dismissal or return focus failed`);
    }
  }
  console.log(
    "16 open-dialog checks passed: actions visible, safe focus, Escape guards and return focus.",
  );
  const themeStory = stories.find((story) => story.id.includes("theme-playground"));
  assert.ok(themeStory, "The theme playground must remain discoverable");
  const themeUrl = new URL("iframe.html", origin);
  themeUrl.searchParams.set("id", themeStory.id);
  themeUrl.searchParams.set("viewMode", "story");
  await browser("open", themeUrl.href);
  await browser("wait", ".story-surface");
  const { result: badgesStable } = await browser(
    "eval",
    `(() => {
    // Controlled CSS fixture: verify nested scopes without depending on a gallery story.
    const outer = document.createElement('div');
    outer.className = 'rw-ui';
    outer.dataset.theme = 'whimsy';
    for (const theme of ['studio','orbital','parchment','whimsy','ledger']) {
      const inner = document.createElement('div');
      inner.className = 'rw-ui'; inner.dataset.theme = theme;
      inner.innerHTML = '<span class="rw-badge">Status</span>'; outer.append(inner);
    }
    document.querySelector('.story-surface').append(outer);
    const read = () => [...outer.querySelectorAll('.rw-badge')].map(e => {
      const style = getComputedStyle(e);
      return [style.color, style.backgroundColor, style.rotate];
    });
    const before = read(); outer.dataset.theme = 'orbital'; const after = read();
    outer.remove(); return JSON.stringify(before) === JSON.stringify(after);
  })()`,
  );
  assert.equal(badgesStable, true, "An outer theme recolored an explicit inner theme");
  console.log("Nested theme badges retain their own colors across outer theme changes.");
} finally {
  await writeFile(resolve(directory, "measurements.json"), `${JSON.stringify(results, null, 2)}\n`);
  await browser("close");
}
console.log(
  `${stories.length * 4} story/viewport checks passed. Screenshots need visual review; this is not a complete accessibility audit.`,
);
