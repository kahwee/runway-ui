const root = Bun.fileURLToPath(new URL("../", import.meta.url));
const outputs = ["dist/runway-ui.css", "styles/icons.css"];
// Read the commit first: rebuilding must not hide a missing committed output.
const committed = outputs.map((path) => {
  const result = Bun.spawnSync(["git", "show", `HEAD:${path}`], {
    cwd: root,
    stdin: "ignore",
    stdout: "pipe",
    stderr: "ignore",
  });
  return result.success ? result.stdout : null;
});
const build = Bun.spawnSync([process.execPath, "scripts/run-build.ts"], {
  cwd: root,
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});
if (!build.success) throw new Error("Generated-output build failed");
let failed = false;
for (const [index, path] of outputs.entries()) {
  const generated = new Uint8Array(
    await Bun.file(new URL(`../${path}`, import.meta.url)).arrayBuffer(),
  );
  if (!committed[index] || !Bun.deepEquals(committed[index], generated)) {
    console.error(`Generated output differs from the commit or is not committed: ${path}`);
    failed = true;
  }
}
if (failed) {
  console.error(
    "Run bun run build, then commit styles/icons.css and dist/runway-ui.css with your source changes.",
  );
  process.exitCode = 1;
} else {
  console.log("Committed generated CSS and declarations match their sources.");
}
