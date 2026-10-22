import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const outputs = ["dist/runway-ui.css", "styles/icons.css"];
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
execFileSync(process.execPath, ["scripts/build.mjs"], { cwd: root, stdio: "inherit" });
let failed = false;
for (const [index, path] of outputs.entries()) {
  const generated = await readFile(new URL(`../${path}`, import.meta.url));
  if (!committed[index]?.equals(generated)) {
    console.error(`Generated CSS differs from the commit or is not committed: ${path}`);
    failed = true;
  }
}
if (failed) {
  console.error(
    "Run pnpm build, then commit styles/icons.css and dist/runway-ui.css with your source changes.",
  );
  process.exitCode = 1;
} else {
  console.log("Committed generated CSS matches its source.");
}
