import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** Emit package declarations from the authoritative TypeScript sources. */
export async function buildDeclarations(kind: "behaviors" | "react", checking = false) {
  const output = await mkdtemp(join(tmpdir(), `runway-${kind}-types-`));
  try {
    const compilation = Bun.spawnSync(
      [
        process.execPath,
        "node_modules/typescript/bin/tsc",
        "-p",
        `tsconfig.${kind}.json`,
        "--outDir",
        output,
        "--noEmitOnError",
      ],
      {
        stdin: "inherit",
        stdout: "inherit",
        stderr: "inherit",
      },
    );
    if (!compilation.success)
      throw new Error(
        `${kind === "behaviors" ? "Behavior" : "React"} declaration compilation failed`,
      );
    await mkdir(`dist/${kind}`, { recursive: true });
    const names = [...new Bun.Glob("*.d.ts").scanSync({ cwd: output, onlyFiles: true })].sort();
    if (!names.length) throw new Error(`No ${kind} declarations emitted`);
    for (const name of names) {
      const emitted = await Bun.file(join(output, name)).text();
      const target = `dist/${kind}/${name}`;
      if (checking) {
        if (!(await Bun.file(target).exists()) || (await Bun.file(target).text()) !== emitted)
          throw new Error(`Stale ${target}; run bun run build.`);
      } else await Bun.write(target, emitted);
    }
  } finally {
    await rm(output, { recursive: true, force: true });
  }
}
if (import.meta.main) await buildDeclarations("behaviors", process.argv.includes("--check"));
