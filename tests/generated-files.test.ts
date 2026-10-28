import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { compileDirectory } from "../scripts/build-runtime.ts";
import { syncGeneratedFiles } from "../scripts/lib/generated-files.ts";

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), "runway-generated-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

test("runtime rebuilds remove retired modules, compile nested owners and preserve declaration output", async (t) => {
  const root = await fixture(t);
  const source = join(root, "source");
  const output = join(root, "output");
  await Bun.write(join(source, "feature/owner.ts"), "export const value: number = 42;");
  await Bun.write(join(source, "index.ts"), 'export { value } from "./feature/owner.ts";');
  await Bun.write(join(output, "retired.js"), "obsolete module");
  await Bun.write(join(output, "feature/retired.js"), "obsolete nested module");
  await Bun.write(join(output, "index.d.ts"), "declarations belong to another generator");
  await compileDirectory(source, output);
  assert.equal(await Bun.file(join(output, "retired.js")).exists(), false);
  assert.equal(await Bun.file(join(output, "feature/retired.js")).exists(), false);
  assert.match(await Bun.file(join(output, "index.js")).text(), /\.\/feature\/owner\.js/);
  assert.match(await Bun.file(join(output, "feature/owner.js")).text(), /42/);
  assert.equal(
    await Bun.file(join(output, "index.d.ts")).text(),
    "declarations belong to another generator",
  );
});

test("runtime syntax failures preserve the entire last successful output", async (t) => {
  const root = await fixture(t);
  const source = join(root, "source");
  const output = join(root, "output");
  await Bun.write(join(source, "a-valid.ts"), "export const value = 2;");
  await Bun.write(join(source, "z-invalid.ts"), "export const invalid = ;");
  await Bun.write(join(output, "a-valid.js"), "last successful build");
  await Bun.write(join(output, "retired.js"), "must survive a failed compilation");
  await assert.rejects(() => compileDirectory(source, output));
  assert.equal(await Bun.file(join(output, "a-valid.js")).text(), "last successful build");
  assert.equal(
    await Bun.file(join(output, "retired.js")).text(),
    "must survive a failed compilation",
  );
});

test("parallel runtime and declaration synchronization prune only their own file types", async (t) => {
  const output = await fixture(t);
  await Bun.write(join(output, "retired.js"), "old runtime");
  await Bun.write(join(output, "retired.d.ts"), "old types");
  await Bun.write(join(output, "keep.css"), "unowned file");
  await Promise.all([
    syncGeneratedFiles(output, new Map([["feature/owner.js", "new runtime"]]), ".js"),
    syncGeneratedFiles(output, new Map([["feature/owner.d.ts", "new types"]]), ".d.ts"),
  ]);
  assert.equal(await Bun.file(join(output, "retired.js")).exists(), false);
  assert.equal(await Bun.file(join(output, "retired.d.ts")).exists(), false);
  assert.equal(await Bun.file(join(output, "feature/owner.js")).text(), "new runtime");
  assert.equal(await Bun.file(join(output, "feature/owner.d.ts")).text(), "new types");
  assert.equal(await Bun.file(join(output, "keep.css")).text(), "unowned file");
});

test("declaration check mode rejects retired output without mutating it", async (t) => {
  const output = await fixture(t);
  await Bun.write(join(output, "owner.d.ts"), "current types");
  await Bun.write(join(output, "retired.d.ts"), "retired types");
  await assert.rejects(
    () => syncGeneratedFiles(output, new Map([["owner.d.ts", "current types"]]), ".d.ts", true),
    /Retired generated file/,
  );
  assert.equal(await Bun.file(join(output, "retired.d.ts")).text(), "retired types");
  assert.equal(await Bun.file(join(output, "owner.d.ts")).text(), "current types");
});
