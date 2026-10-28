import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
const excluded = new Set([
  "node_modules",
  ".git",
  "dist",
  ".site",
  ".types",
  ".local",
  "storybook-static",
]);
export async function checkTypeScriptSource(root: string): Promise<string[]> {
  const failures: string[] = [];
  async function scan(directory: string) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory() && !excluded.has(entry.name)) await scan(path);
      else if (entry.isFile()) {
        if (/\.(?:c?js|mjs|jsx)$/.test(entry.name)) failures.push(path);
        if (entry.name.endsWith(".html")) {
          const source = await readFile(path, "utf8");
          if (
            /<script\b[^>]*>\s*[^<\s]/i.test(source) ||
            /\son(?:click|change|input|load)\s*=/i.test(source)
          )
            failures.push(`${path}: inline script`);
        }
      }
    }
  }
  await scan(root);
  return failures;
}
if (import.meta.main) {
  const failures = await checkTypeScriptSource(".");
  if (failures.length) throw new Error(`Authored code must be TypeScript:\n${failures.join("\n")}`);
  console.log("All authored modules are TypeScript; JavaScript is generated only.");
}
