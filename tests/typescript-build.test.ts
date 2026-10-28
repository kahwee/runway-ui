import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { browserImports } from "../scripts/build-runtime.ts";
import { checkTypeScriptSource } from "../scripts/check-typescript-source.ts";

test("all authored modules and browser entry points use TypeScript", async () => {
  assert.deepEqual(await checkTypeScriptSource("."), []);
});
test("browser compilation rewrites static, lazy and URL module paths without changing text", () => {
  const input = `import { x } from './x.ts'; export { y } from './y.ts'; const p = import('./lazy.ts'); const u = new URL('panel.ts', import.meta.url); const text = 'panel.ts';`;
  const result = browserImports(input);
  assert.match(result, /from "\.\/x\.js"/);
  assert.match(result, /from "\.\/y\.js"/);
  assert.match(result, /import\("\.\/lazy\.js"\)/);
  assert.match(result, /new URL\("panel\.js"/);
  assert.match(result, /text = 'panel.ts'/);
});
test("every public runtime export has generated executable JavaScript and declarations", async () => {
  const pkg = JSON.parse(await readFile("package.json", "utf8"));
  for (const entry of Object.values(pkg.exports)) {
    if (typeof entry !== "object" || entry === null) continue;
    const target = entry as { default: string; types: string };
    assert.match(target.default, /^\.\/dist\/(behaviors|react)\/.*\.js$/);
    assert.ok((await readFile(target.default, "utf8")).length > 0);
    assert.ok((await readFile(target.types, "utf8")).includes("export"));
  }
  const { bindDialog } = await import("@kahwee/runway-ui/dialog");
  assert.equal(typeof bindDialog, "function");
});

test("package runtime and declaration inventories exactly match current source owners", () => {
  for (const kind of ["behaviors", "react"]) {
    const owners = [...new Bun.Glob("**/*.ts").scanSync({ cwd: kind, onlyFiles: true })].filter(
      (name) => !name.endsWith(".d.ts"),
    );
    for (const extension of [".js", ".d.ts"]) {
      const expected = owners.map((name) => name.replace(/\.ts$/, extension)).sort();
      const actual = [
        ...new Bun.Glob(`**/*${extension}`).scanSync({ cwd: `dist/${kind}`, onlyFiles: true }),
      ].sort();
      assert.deepEqual(
        actual,
        expected,
        `${kind} ${extension}: missing or retired generated owner`,
      );
    }
  }
});
