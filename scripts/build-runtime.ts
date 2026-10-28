import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { parse } from "@babel/parser";

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
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const input = join(source, entry.name),
      output = join(destination, entry.name);
    if (entry.isDirectory()) await compileDirectory(input, output);
    else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")) {
      const target = output.replace(/\.ts$/, ".js");
      await mkdir(dirname(target), { recursive: true });
      await writeFile(
        target,
        browserImports(compiler.transformSync(await readFile(input, "utf8"))),
      );
    }
  }
}
if (import.meta.main) {
  await Promise.all([
    compileDirectory("behaviors", "dist/behaviors"),
    compileDirectory("react", "dist/react"),
  ]);
}
