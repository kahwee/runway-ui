import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "@babel/parser";
import { syncGeneratedFiles } from "./lib/generated-files.ts";

/** Rewrite module specifiers only; never alter displayed strings or user data. */
export function browserImports(source: string): string {
  const ast = parse(source, { sourceType: "module", createImportExpressions: true });
  const edits: { start: number; end: number; text: string }[] = [];
  function walk(node: unknown) {
    if (!node || typeof node !== "object") return;
    const n = node as {
      type?: string;
      source?: { type: string; value: string; start: number; end: number };
    };
    if (
      [
        "ImportDeclaration",
        "ExportNamedDeclaration",
        "ExportAllDeclaration",
        "ImportExpression",
      ].includes(n.type ?? "")
    ) {
      const s = n.source;
      if (s?.type === "StringLiteral" && /^\.{1,2}\//.test(s.value) && /\.tsx?$/.test(s.value))
        edits.push({
          start: s.start,
          end: s.end,
          text: JSON.stringify(s.value.replace(/\.tsx?$/, ".js")),
        });
    }
    const url = node as {
      type?: string;
      callee?: { name?: string };
      arguments?: { type: string; value?: string; start: number; end: number }[];
    };
    if (url.type === "NewExpression" && url.callee?.name === "URL") {
      const first = url.arguments?.[0];
      if (
        first?.type === "StringLiteral" &&
        first.value &&
        /\.tsx?$/.test(first.value) &&
        !/^[a-z]+:/i.test(first.value)
      )
        edits.push({
          start: first.start,
          end: first.end,
          text: JSON.stringify(first.value.replace(/\.tsx?$/, ".js")),
        });
    }
    for (const [key, value] of Object.entries(node)) {
      if (["loc", "comments", "leadingComments", "trailingComments"].includes(key)) continue;
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === "object") walk(value);
    }
  }
  walk(ast.program);
  for (const edit of edits.sort((a, b) => b.start - a.start))
    source = source.slice(0, edit.start) + edit.text + source.slice(edit.end);
  return source;
}
export async function compileDirectory(source: string, destination: string) {
  const compiler = new Bun.Transpiler({ loader: "ts", target: "browser" });
  const files = new Map<string, string>();
  async function compile(directory: string, prefix = "") {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const input = join(directory, entry.name);
      const name = join(prefix, entry.name);
      if (entry.isDirectory()) await compile(input, name);
      else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts"))
        files.set(
          name.replace(/\.ts$/, ".js"),
          browserImports(compiler.transformSync(await readFile(input, "utf8"))),
        );
    }
  }
  // Compile everything before replacing files: a syntax error must preserve the last build.
  await compile(source);
  await syncGeneratedFiles(destination, files, ".js");
}
if (import.meta.main) {
  const root = Bun.fileURLToPath(new URL("../", import.meta.url));
  await Promise.all([
    compileDirectory(join(root, "behaviors"), join(root, "dist/behaviors")),
    compileDirectory(join(root, "react"), join(root, "dist/react")),
  ]);
}
