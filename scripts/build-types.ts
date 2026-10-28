import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { syncGeneratedFiles } from "./lib/generated-files.ts";

const root = Bun.fileURLToPath(new URL("../", import.meta.url));

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
        cwd: root,
        stdin: "inherit",
        stdout: "inherit",
        stderr: "inherit",
      },
    );
    if (!compilation.success)
      throw new Error(
        `${kind === "behaviors" ? "Behavior" : "React"} declaration compilation failed`,
      );
    const names = [...new Bun.Glob("**/*.d.ts").scanSync({ cwd: output, onlyFiles: true })].sort();
    if (!names.length) throw new Error(`No ${kind} declarations emitted`);
    const files = new Map<string, string>();
    for (const name of names) {
      files.set(name, await Bun.file(join(output, name)).text());
    }
    await syncGeneratedFiles(join(root, "dist", kind), files, ".d.ts", checking);
  } finally {
    await rm(output, { recursive: true, force: true });
  }
}
if (import.meta.main) await buildDeclarations("behaviors", process.argv.includes("--check"));
