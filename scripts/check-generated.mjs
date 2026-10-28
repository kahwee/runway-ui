import { execFileSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const outputs = [
  "dist/runway-ui.css",
  "styles/icons.css",
  ...(await readdir(new URL("../behaviors/", import.meta.url)))
    .filter((name) => name.endsWith(".js"))
    .map((name) => `behaviors/${name.replace(/\.js$/, ".d.ts")}`),
];
// Read the commit first: rebuilding must not hide a missing committed output.
const committed = outputs.map((path) => {
  try {
    return execFileSync("git", ["show", `HEAD:${path}`], {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch {
    return null;
  }
});
execFileSync(process.execPath, ["scripts/build-types.mjs"], { cwd: root, stdio: "inherit" });
execFileSync(process.execPath, ["scripts/build.mjs"], { cwd: root, stdio: "inherit" });
let failed = false;
for (const [index, path] of outputs.entries()) {
  const generated = await readFile(new URL(`../${path}`, import.meta.url));
  if (!committed[index]?.equals(generated)) {
    console.error(`Generated output differs from the commit or is not committed: ${path}`);
    failed = true;
  }
}
if (failed) {
  console.error(
    "Run bun run build, then commit generated declarations, styles/icons.css and dist/runway-ui.css with your source changes.",
  );
  process.exitCode = 1;
} else {
  console.log("Committed generated CSS and declarations match their sources.");
}
