import { mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";

/** Synchronize only one generator's file type; sibling generators may run concurrently. */
export async function syncGeneratedFiles(
  directory: string,
  files: ReadonlyMap<string, string>,
  extension: ".js" | ".d.ts",
  checking = false,
) {
  let previous: string[] = [];
  try {
    previous = [...new Bun.Glob(`**/*${extension}`).scanSync({ cwd: directory, onlyFiles: true })];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  for (const [name, contents] of files) {
    const target = join(directory, name);
    if (checking) {
      if (!(await Bun.file(target).exists()) || (await Bun.file(target).text()) !== contents)
        throw new Error(`Stale ${target}; run bun run build.`);
    } else {
      await mkdir(dirname(target), { recursive: true });
      await Bun.write(target, contents);
    }
  }
  for (const name of previous) {
    if (files.has(name)) continue;
    const target = join(directory, name);
    if (checking) throw new Error(`Retired generated file ${target}; run bun run build.`);
    await rm(target);
  }
}
