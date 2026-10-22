import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const output = new URL("../.site/", import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
// Explicit public allowlist: never copy the checkout or local evidence wholesale.
for (const path of [
  "index.html",
  "workshop",
  "index.css",
  "styles",
  "behaviors",
  "dist",
  "docs",
  "examples",
  "LICENSE",
]) {
  await cp(new URL(`../${path}`, import.meta.url), new URL(path, output), { recursive: true });
}
await cp(new URL("../storybook-static/", import.meta.url), new URL("storybook/", output), {
  recursive: true,
});
await writeFile(new URL(".nojekyll", output), "");
console.log("Built .site/ with workshop, documentation and HTML Storybook.");
// Render trusted repository-authored Markdown at build time; no client renderer.
const { marked } = await import("marked");
const { readdir, readFile } = await import("node:fs/promises");
// Keep the guide distinct from the hand-authored chart lab on case-insensitive disks.
const htmlPath = (path) =>
  path.endsWith("CHARTS") ? `${path.slice(0, -6)}charts-guide.html` : `${path}.html`;
const headingIds = new Map();
marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const base = text
        .replace(/<[^>]*>/g, "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}_\s-]/gu, "")
        .replace(/\s/g, "-");
      const count = headingIds.get(base) ?? 0;
      headingIds.set(base, count + 1);
      return `<h${depth} id="${base}${count ? `-${count}` : ""}">${text}</h${depth}>\n`;
    },
  },
});
const rewriteLinks = (html) =>
  html.replace(/href="([^":]*?)\.md(#[^"]*)?"/g, (_, path, hash = "") =>
    ["../README", "../CONTRIBUTING"].includes(path)
      ? `href="https://github.com/kahwee/runway-ui/blob/main/${path.slice(3)}.md${hash}"`
      : `href="${htmlPath(path)}${hash}"`,
  );
for (const file of await readdir(new URL("docs/", output))) {
  if (!file.endsWith(".md")) continue;
  const source = await readFile(new URL(`docs/${file}`, output), "utf8");
  const title = (source.match(/^# (.+)/m)?.[1] ?? "Documentation").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
  headingIds.clear();
  const body = rewriteLinks(marked.parse(source));
  await writeFile(
    new URL(`docs/${htmlPath(file.replace(/\.md$/, ""))}`, output),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · Runway UI</title><link rel="stylesheet" href="../index.css"><link rel="stylesheet" href="docs.css"><link rel="stylesheet" href="reference.css"></head><body class="rw-ui"><main class="reference-page"><nav class="reference-nav"><a href="README.html">Documentation map</a><a href="./#reference">Component reference</a><a href="../storybook/">Storybook ↗</a><a href="charts.html">Chart lab ↗</a></nav><article>${body}</article><footer>Runway UI · MIT · HTML and CSS</footer></main></body></html>`,
  );
}
for (const file of ["docs/index.html", "docs/charts.html"]) {
  const url = new URL(file, output);
  await writeFile(url, rewriteLinks(await readFile(url, "utf8")));
}
