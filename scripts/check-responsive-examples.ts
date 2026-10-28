// Build .site, serve it, then run explicitly with an installed agent-browser.
// bun scripts/check-responsive-examples.ts http://127.0.0.1:6011 [artifact-directory]
import assert from "node:assert/strict";
import { resolve } from "node:path";

const origin = new URL(process.argv[2] ?? "http://127.0.0.1:6011");
const directory = resolve(process.argv[3] ?? ".local/responsive-examples");
const session = `runway-examples-${process.pid}`;
const pages = [
  "/",
  "/docs/",
  "/docs/charts.html",
  "/examples/controls.html",
  "/examples/layouts.html",
  "/examples/colony.html",
  "/examples/view-tabs.html",
  "/examples/drop-in.html",
  "/examples/studio.html",
  "/examples/lazy-workspace/",
  "/examples/observatory.html",
];
const results = [];
await Bun.write(resolve(directory, "measurements.json"), "[]\n", { createPath: true });
async function browser(...args) {
  const child = Bun.spawn(["agent-browser", "--session", session, "--json", ...args], {
    stdout: "pipe",
    stderr: "pipe",
  });
  const timeout = setTimeout(() => child.kill(), 45_000);
  try {
    const [stdout, stderr, code] = await Promise.all([
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
      child.exited,
    ]);
    assert.equal(code, 0, stderr);
    const response = JSON.parse(stdout);
    assert.equal(response.success, true, JSON.stringify(response.error));
    return response.data;
  } finally {
    clearTimeout(timeout);
  }
}
let resourceValues;
try {
  for (const [width, height] of [
    [320, 740],
    [390, 844],
    [768, 1024],
    [1366, 768],
    [1440, 900],
  ]) {
    await browser("set", "viewport", String(width), String(height));
    for (const [index, path] of pages.entries()) {
      await browser("open", new URL(path, origin).href);
      const { result } = await browser(
        "eval",
        `(async () => {
        await document.fonts.ready;
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        const visible = e => e.getBoundingClientRect().height > 0;
        return { width: document.documentElement.scrollWidth,
          mainVisible: [...document.querySelectorAll('main')].some(visible),
          blocked: [...document.querySelectorAll('.unsupported,.notice')].some(visible),
          resources: [...document.querySelectorAll('.rw-resource-ledger__row:not([data-heading])')]
            .map(e => e.textContent.replace(/\\s+/g, ' ').trim()) };
      })()`,
      );
      results.push({ path, width, height, ...result });
      await browser("screenshot", resolve(directory, `${width}-${index + 1}.png`), "--full");
      assert.ok(
        result.mainVisible && !result.blocked,
        `${path}: content replaced by a viewport gate`,
      );
      assert.ok(
        result.width <= width + 1,
        `${width}px ${path}: page overflows to ${result.width}px`,
      );
      if (path.endsWith("observatory.html")) {
        if (resourceValues)
          assert.deepEqual(result.resources, resourceValues, "Resizing changed resource data");
        resourceValues = result.resources;
      }
    }
    console.log(
      `${width}px: all ${pages.length} public pages are available without page overflow.`,
    );
  }
  await browser("set", "viewport", "390", "844");
  await browser("open", new URL("/examples/observatory.html", origin).href);
  await browser("snapshot", "-i");
  const { result: initialRows } = await browser(
    "eval",
    "document.querySelector('.rw-resource-ledger').textContent",
  );
  await browser("click", '[data-inspect="1"]');
  assert.equal(
    (await browser("eval", "document.querySelector('[data-inspector] h3').textContent")).result,
    "Materials",
  );
  await browser("snapshot", "-i");
  await browser("click", ".rw-resource-inspect-link");
  assert.equal(
    (await browser("eval", "document.activeElement.hasAttribute('data-inspector')")).result,
    true,
  );
  await browser("snapshot", "-i");
  await browser("click", '[command="show-modal"]');
  assert.equal((await browser("eval", "document.querySelector('dialog').open")).result, true);
  await browser("snapshot", "-i");
  await browser("click", 'button[value="cancel"]');
  await browser("snapshot", "-i");
  await browser("click", '[command="show-modal"]');
  await browser("snapshot", "-i");
  await browser("click", 'button[value="pin"]');
  const { result: pinned } = await browser(
    "eval",
    `({
    status: document.querySelector('[data-plan-status]').textContent,
    rows: document.querySelector('.rw-resource-ledger').textContent,
    closed: !document.querySelector('dialog').open
  })`,
  );
  assert.ok(
    pinned.closed && pinned.status.includes("Plan pinned for Materials. No resources spent"),
  );
  assert.equal(pinned.rows, initialRows, "Reviewing and pinning a preview spent resources");
  console.log(
    "Mobile selection, inspector focus, Cancel and Pin passed without changing resource values.",
  );
} finally {
  await Bun.write(resolve(directory, "measurements.json"), `${JSON.stringify(results, null, 2)}\n`);
  await browser("close");
}
