import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, relative, sep } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
async function inline(path, ancestors = new Set()) {
  if (ancestors.has(path)) throw new Error(`Circular CSS import: ${relative(root,path)}`);
  const chain = new Set(ancestors).add(path);
  const source = await readFile(path,'utf8');
  const pattern = /@import\s+url\(['"]([^'"]+)['"]\);/g;
  let cursor = 0, output = '';
  for (const match of source.matchAll(pattern)) {
    const target = resolve(dirname(path),match[1]);
    if (!target.startsWith(root.endsWith(sep) ? root : root + sep)) throw new Error('CSS imports must remain in the package');
    output += source.slice(cursor,match.index) + await inline(target,chain);
    cursor = match.index + match[0].length;
  }
  return output + source.slice(cursor);
}
const css = await inline(resolve(root,'index.css'));
await mkdir(resolve(root,'dist'),{recursive:true});
await writeFile(resolve(root,'dist/runway-ui.css'),'/*! Runway UI | MIT License | https://github.com/kahwee/runway-ui */\n'+css.trimEnd()+'\n');
console.log('Built dist/runway-ui.css (no external CSS imports)');
