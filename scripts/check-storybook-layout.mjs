// Explicit browser review tool, not a runtime or CI dependency.
// Build Storybook, serve storybook-static, then:
// bun scripts/check-storybook-layout.mjs http://127.0.0.1:6006 [artifact-directory]
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
const stories = Object.values((await index.json()).entries).filter((e) => e.type === "story");
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
  let themedBadges;
  for (const outerTheme of ["whimsy", "orbital"]) {
    const url = new URL("iframe.html", origin);
    url.searchParams.set("id", "start-here-many-worlds--gallery");
    url.searchParams.set("viewMode", "story");
    url.searchParams.set("globals", `theme:${outerTheme}`);
    await browser("open", url.href);
    await browser("wait", ".worlds-gallery");
    const { result } = await browser(
      "eval",
      `
      [...document.querySelectorAll('.worlds-tile')].map(tile => {
        const style = getComputedStyle(tile.querySelector('.rw-badge'));
        return { theme: tile.dataset.theme, color: style.color,
          background: style.backgroundColor, rotate: style.rotate };
      })`,
    );
    assert.equal(result.length, 5, "All five nested theme specimens must render");
    if (themedBadges)
      assert.deepEqual(result, themedBadges, "An outer theme recolored inner badges");
    themedBadges = result;
  }
  console.log("Nested theme badges retain their own colors across outer theme changes.");
} finally {
  await writeFile(resolve(directory, "measurements.json"), `${JSON.stringify(results, null, 2)}\n`);
  await browser("close");
}
console.log(
  `${stories.length * 4} story/viewport checks passed. Screenshots need visual review; this is not a complete accessibility audit.`,
);
