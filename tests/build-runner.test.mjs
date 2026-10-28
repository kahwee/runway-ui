import assert from "node:assert/strict";
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

for (const failure of [false, true]) {
  test(`build coordinator waits for every generator (${failure ? "failure" : "success"})`, async (t) => {
    const root = await mkdtemp(join(tmpdir(), "runway-build-test-"));
    t.after(() => rm(root, { recursive: true, force: true }));
    await mkdir(join(root, "scripts"));
    await copyFile(
      new URL("../scripts/run-build.mjs", import.meta.url),
      join(root, "scripts/run-build.mjs"),
    );
    await writeFile(
      join(root, "scripts/build-types.mjs"),
      failure ? "process.exit(7);" : "process.exit(0);",
    );
    for (const task of ["build-react-types.mjs", "build.mjs"])
      await writeFile(
        join(root, "scripts", task),
        `await new Promise(resolve => setTimeout(resolve, 50)); await Bun.write(${JSON.stringify(join(root, `${task}.done`))}, "done");`,
      );
    const child = Bun.spawn([process.execPath, join(root, "scripts/run-build.mjs")], {
      cwd: tmpdir(),
      stdout: "pipe",
      stderr: "pipe",
    });
    assert.equal(await child.exited, failure ? 1 : 0);
    for (const task of ["build-react-types.mjs", "build.mjs"])
      assert.equal(await readFile(join(root, `${task}.done`), "utf8"), "done");
    if (failure)
      assert.match(
        await new Response(child.stderr).text(),
        /build-types.mjs failed with exit code 7/,
      );
  });
}
