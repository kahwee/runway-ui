import { extname, resolve } from "node:path";

const directories = [
  "behaviors",
  "react",
  "styles",
  "examples",
  "stories",
  ".storybook",
  "scripts",
  "tests",
  "docs",
  "workshop",
];
const extensions = new Set([".js", ".mjs", ".ts", ".tsx", ".css", ".html"]);

/** Source inventory shared by the import graph; generated output is deliberately excluded. */
export async function sourceFiles(root: string): Promise<string[]> {
  const result: string[] = [];
  async function scan(directory: string, recursive: boolean) {
    try {
      for await (const path of new Bun.Glob(`${recursive ? "**/" : ""}*`).scan({
        cwd: directory,
        absolute: true,
        onlyFiles: true,
        dot: true,
        followSymlinks: false,
      }))
        if (extensions.has(extname(path))) result.push(path);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  await scan(root, false);
  for (const directory of directories) await scan(resolve(root, directory), true);
  return result.sort();
}
