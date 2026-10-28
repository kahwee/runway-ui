import assert from "node:assert/strict";
import { stat, mkdir } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { chromium, type Page } from "playwright";

// Exercise the exact publication artifact below a project prefix, with real 404s.
// A supplied URL runs the same check against the public deployment.
const root = resolve(".site");
const prefix = "/runway-ui/";
const evidence = resolve(".local/pages-check");
await mkdir(evidence, { recursive: true });
const server = process.argv[2]
  ? undefined
  : Bun.serve({
      hostname: "127.0.0.1",
      port: 0,
      async fetch(request) {
        const url = new URL(request.url);
        if (!url.pathname.startsWith(prefix)) return new Response("Not found", { status: 404 });
        let target: string;
        try {
          target = resolve(root, decodeURIComponent(url.pathname.slice(prefix.length)));
          if (target !== root && !target.startsWith(root + sep))
            return new Response("Not found", { status: 404 });
          if ((await stat(target)).isDirectory()) target = resolve(target, "index.html");
          const file = Bun.file(target);
          if (!(await file.exists())) return new Response("Not found", { status: 404 });
          return new Response(file);
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    });
const base = new URL(process.argv[2] || `http://127.0.0.1:${server.port}${prefix}`);
if (!base.pathname.endsWith("/")) base.pathname += "/";
const failures: string[] = [];
const errors: string[] = [];
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
    process.env.AGENT_BROWSER_EXECUTABLE_PATH ||
    ((await Bun.file("/usr/bin/chromium").exists()) ? "/usr/bin/chromium" : undefined),
});
let scans = 0;
function observe(page: Page) {
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.url().startsWith(base.origin) && response.status() >= 400)
      failures.push(`${response.status()} ${response.url()}`);
  });
}
async function scan(page: Page, name: string) {
  await page.evaluate(() => document.fonts.ready);
  assert.ok(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    `${name}: horizontal overflow`,
  );
  await page.screenshot({ path: resolve(evidence, `${name}.png`), fullPage: true });
  scans++;
}
function storyUrl(id: string, args = "", globals = "") {
  const url = new URL("storybook/iframe.html", base);
  url.searchParams.set("id", id);
  url.searchParams.set("viewMode", "story");
  if (args) url.searchParams.set("args", args);
  if (globals) url.searchParams.set("globals", globals);
  return url.href;
}
try {
  for (const path of [
    "",
    "storybook/",
    "storybook/index.json",
    "docs/README.html",
    "docs/DEPENDENCIES.html",
    "LICENSE",
  ]) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 200, `${path || "homepage"}: publication endpoint`);
  }
  const index = await (await fetch(new URL("storybook/index.json", base))).json();
  assert.ok(index.entries["start-here-recipe-book--playground"], "Recipe book is indexed");
  for (const width of [320, 390, 768, 1366, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: width === 1366 ? 768 : 900 },
      reducedMotion: "reduce",
    });
    observe(page);
    await page.goto(base.href, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "One kit. Different worlds." }).waitFor();
    assert.equal(
      await page.getByRole("link", { name: "Build your first panel" }).getAttribute("href"),
      "./storybook/?path=/story/start-here-recipe-book--playground",
    );
    await scan(page, `home-${width}`);
    await page.goto(storyUrl("start-here-runway-ui--welcome"), { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Take a little tour." }).waitFor();
    await scan(page, `welcome-${width}`);
    await page.goto(storyUrl("start-here-recipe-book--playground"), { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "A recipe for a little possibility." }).waitFor();
    await page
      .locator(".recipe-book__sample")
      .getByRole("button", { name: "Plan expedition" })
      .click();
    await page.getByRole("status").filter({ hasText: "Expedition planned" }).waitFor();
    await page.getByRole("button", { name: "Copy HTML" }).click();
    await page
      .getByRole("status")
      .filter({ hasText: /HTML copied|Clipboard unavailable/ })
      .waitFor();
    assert.match(await page.locator(".recipe-book__source code").textContent(), /runway-ui\.css/);
    await scan(page, `recipe-${width}`);
    await page.goto(
      storyUrl("start-here-recipe-book--playground", "recipe:Native dialog", "theme:orbital"),
      { waitUntil: "networkidle" },
    );
    await page.getByRole("button", { name: "Open expedition brief" }).click();
    const dialog = page.getByRole("dialog", { name: "Prepare the expedition" });
    await dialog.waitFor();
    assert.ok(
      await dialog
        .getByRole("button", { name: "Not yet" })
        .evaluate((el) => el === document.activeElement),
      "Dialog starts on the safe action",
    );
    await scan(page, `dialog-${width}-dark`);
    await dialog.getByRole("button", { name: "Plan expedition", exact: true }).click();
    await dialog.waitFor({ state: "hidden" });
    await page.getByRole("status").filter({ hasText: "Plan confirmed" }).waitFor();
    await page.getByRole("button", { name: "Open expedition brief" }).click();
    await dialog.waitFor();
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    assert.ok(
      await page
        .getByRole("button", { name: "Open expedition brief" })
        .evaluate((el) => el === document.activeElement),
      "Dialog restores invoker focus",
    );
    await page.getByRole("status").filter({ hasText: "Decision cancelled" }).waitFor();
    await page.close();
  }
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  observe(page);
  await page.goto(new URL("storybook/?path=/story/start-here-runway-ui--welcome", base).href, {
    waitUntil: "networkidle",
  });
  await page
    .frameLocator("#storybook-preview-iframe")
    .getByRole("heading", { name: "Take a little tour." })
    .waitFor();
  assert.equal(
    await page.getByText("This story has no controls", { exact: true }).count(),
    0,
    "Welcome has no empty Controls panel",
  );
  await page.screenshot({ path: resolve(evidence, "storybook-welcome.png"), fullPage: true });
  await page.goto(new URL("storybook/?path=/story/start-here-recipe-book--playground", base).href, {
    waitUntil: "networkidle",
  });
  await page
    .frameLocator("#storybook-preview-iframe")
    .getByRole("heading", { name: "Make it yours" })
    .waitFor();
  await page.getByRole("tab", { name: /^Controls/ }).waitFor();
  await page.locator("#control-recipe").selectOption("Resource HUD");
  await page
    .frameLocator("#storybook-preview-iframe")
    .getByRole("heading", { name: "Resource HUD", exact: true })
    .waitFor();
  await page.screenshot({ path: resolve(evidence, "storybook-controls.png"), fullPage: true });
  await page.close();
  assert.deepEqual(errors, [], "Published pages have no uncaught browser errors");
  assert.deepEqual(
    [...new Set(failures)],
    [],
    "Published pages load every requested asset under the project prefix",
  );
  console.log(
    `Pages browser checks passed: ${scans} accessibility/viewport scans, manager navigation, live Controls, copy feedback, modal focus/Escape, and zero failed local assets. ${base.href}`,
  );
} finally {
  await browser.close();
  server?.stop(true);
}
