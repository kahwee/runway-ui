import { stat } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import { parse } from "parse5";

const root = Bun.fileURLToPath(new URL("../.site/", import.meta.url));
const cache = new Map();
async function page(path) {
  if (cache.has(path)) return cache.get(path);
  const result = { ids: new Set(), links: [] };
  function walk(node) {
    for (const { name, value } of node.attrs ?? []) {
      if (name === "id") result.ids.add(value);
      if (name === "href" || name === "src") result.links.push(value);
    }
    for (const child of node.childNodes ?? []) walk(child);
  }
  walk(parse(await Bun.file(path).text()));
  cache.set(path, result);
  return result;
}
const failures = [];
let checked = 0;
for await (const name of new Bun.Glob("*.html").scan({
  cwd: resolve(root, "docs"),
  onlyFiles: true,
  dot: true,
})) {
  const source = resolve(root, "docs", name);
  for (const link of (await page(source)).links) {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(link)) continue;
    checked++;
    const url = new URL(link, `file://${source}`);
    let target = Bun.fileURLToPath(url);
    try {
      if (!target.startsWith(root.endsWith(sep) ? root : root + sep))
        throw new Error("outside generated site");
      if ((await stat(target)).isDirectory()) target = resolve(target, "index.html");
      await stat(target);
      if (url.hash && target.endsWith(".html")) {
        const id = decodeURIComponent(url.hash.slice(1));
        if (!(await page(target)).ids.has(id)) throw new Error(`missing anchor ${id}`);
      }
    } catch (error) {
      failures.push(`${relative(root, source)} → ${link}: ${error.message}`);
    }
  }
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else console.log(`Documentation links passed: ${checked} local links and assets.`);
