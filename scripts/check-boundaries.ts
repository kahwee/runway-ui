import { access } from "node:fs/promises";
import { dirname, extname, relative, resolve } from "node:path";
import { parse } from "@babel/parser";
import { parse as parseHtml } from "parse5";
import postcss from "postcss";

const sourceDirectories = [
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
const sourceExtensions = new Set([".js", ".mjs", ".ts", ".tsx", ".css", ".html"]);
const runtime = (path) => path === "index.css" || /^(behaviors|styles)\//.test(path);
// Foundations may compose foundations, but never workspace or game patterns.
const foundationStyle = (path) =>
  /^styles\/(?:tokens|primitives|controls|panels|native|fields|forms)(?:\.css|\/)/.test(path);
const external = (path) => !path.startsWith(".") && !path.startsWith("/");
const literal = (node) => {
  if (["StringLiteral", "NumericLiteral"].includes(node?.type)) return String(node.value);
  if (node?.type === "TemplateLiteral" && node.expressions.length === 0)
    return node.quasis[0].value.cooked;
};
function walk(node, visit) {
  if (!node || typeof node !== "object") return;
  if (node.type) visit(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) for (const child of value) walk(child, visit);
    else if (value && typeof value === "object") walk(value, visit);
  }
}
async function sources(root) {
  const result = [];
  async function scan(directory, recursive) {
    const pattern = `${recursive ? "**/" : ""}*`;
    try {
      for await (const path of new Bun.Glob(pattern).scan({
        cwd: directory,
        absolute: true,
        onlyFiles: true,
        dot: true,
        followSymlinks: false,
      })) {
        if (sourceExtensions.has(extname(path))) result.push(path);
      }
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  await scan(root, false);
  for (const directory of sourceDirectories) await scan(resolve(root, directory), true);
  return result.sort();
}
function declaredNames(node) {
  if (!node) return [];
  if (node.type === "Identifier") return [node.name];
  if (node.type === "VariableDeclaration")
    return node.declarations.flatMap((d) => declaredNames(d.id));
  if (node.type === "ObjectPattern")
    return node.properties.flatMap((p) => declaredNames(p.value ?? p.argument));
  if (node.type === "ArrayPattern") return node.elements.flatMap(declaredNames);
  if (node.type === "AssignmentPattern") return declaredNames(node.left);
  if (node.type === "RestElement") return declaredNames(node.argument);
  return node.id ? declaredNames(node.id) : [];
}

/** Inspect source without executing browser modules. Returns actionable diagnostics. */
export async function checkBoundaries(root) {
  root = resolve(root);
  const diagnostics = [];
  const graph = new Map();
  const exports = new Map();
  const stars = new Map();
  const imports = [];
  const label = (path) => relative(root, path).replaceAll("\\", "/");
  const report = (file: string, message: string, line?: number) =>
    diagnostics.push(`${file}${line ? `:${line}` : ""}: ${message}`);
  function javascript(source, file, typescript = false) {
    const names = exports.get(file) ?? new Set();
    exports.set(file, names);
    const addImport = (node, value) => {
      if (value === undefined) {
        if (runtime(file))
          report(file, "Runtime dynamic imports must use a literal path", node.loc?.start.line);
        return;
      }
      imports.push({ file, value, line: node.loc?.start.line });
    };
    let ast;
    try {
      ast = parse(source, {
        sourceType: "unambiguous",
        createImportExpressions: true,
        plugins: typescript ? ["typescript", "jsx"] : [],
      });
    } catch (error) {
      report(file, error.message);
      return;
    }
    walk(ast, (node) => {
      if (
        ["ImportDeclaration", "ExportNamedDeclaration", "ExportAllDeclaration"].includes(
          node.type,
        ) &&
        node.source
      )
        addImport(node, node.source.value);
      if (node.type === "ImportExpression") addImport(node, literal(node.source));
      if (node.type === "CallExpression" && node.callee.type === "Import")
        addImport(node, literal(node.arguments[0]));
      if (node.type === "ExportNamedDeclaration") {
        for (const name of declaredNames(node.declaration)) names.add(name);
        for (const specifier of node.specifiers)
          names.add(specifier.exported?.name ?? specifier.exported?.value);
      }
      if (node.type === "ExportAllDeclaration") {
        const list = stars.get(file) ?? [];
        list.push(node.source.value);
        stars.set(file, list);
      }
      if (node.type === "ObjectExpression") {
        const keys = new Map();
        for (const property of node.properties) {
          if (property.type === "SpreadElement") continue;
          const key = property.computed
            ? literal(property.key)
            : (property.key.name ?? literal(property.key));
          if (key === undefined) continue;
          const kind = property.kind ?? "value";
          const previous = keys.get(key);
          if (
            previous &&
            !(
              previous.size === 1 &&
              ((previous.has("get") && kind === "set") || (previous.has("set") && kind === "get"))
            )
          )
            report(file, `Duplicate object/handler key "${key}"`, property.loc?.start.line);
          keys.set(key, new Set([...(previous ?? []), kind]));
        }
      }
      if (
        node.type === "NewExpression" &&
        node.callee.type === "Identifier" &&
        node.callee.name === "Map" &&
        node.arguments[0]?.type === "ArrayExpression"
      ) {
        const keys = new Set();
        for (const entry of node.arguments[0].elements) {
          if (entry?.type !== "ArrayExpression") continue;
          const key = literal(entry.elements[0]);
          if (key === undefined) continue;
          const identity = `${entry.elements[0].type === "NumericLiteral" ? "number" : "string"}:${key}`;
          if (keys.has(identity))
            report(file, `Duplicate Map/handler key "${key}"`, entry.loc?.start.line);
          keys.add(identity);
        }
      }
    });
  }
  function css(source, file) {
    try {
      postcss.parse(source, { from: file }).walkAtRules("import", (node) => {
        const match = node.params.match(
          /^(?:url\(\s*(?:"([^"]+)"|'([^']+)'|([^\s)]+))\s*\)|"([^"]+)"|'([^']+)')/,
        );
        if (!match) report(file, `Unsupported CSS import: ${node.params}`, node.source.start.line);
        else
          imports.push({
            file,
            value: match.slice(1).find(Boolean),
            line: node.source.start.line,
            kind: "url",
          });
      });
    } catch (error) {
      report(file, error.message);
    }
  }
  for (const path of await sources(root)) {
    const file = label(path);
    graph.set(file, new Set());
    const source = await Bun.file(path).text();
    if (file.endsWith(".css")) css(source, file);
    else if (file.endsWith(".html")) {
      function html(node) {
        const attributes = Object.fromEntries(
          (node.attrs ?? []).map(({ name, value }) => [name, value]),
        );
        const body = (node.childNodes ?? []).map((child) => child.value ?? "").join("");
        if (node.tagName === "script" && attributes.type === "module") {
          if (attributes.src) imports.push({ file, value: attributes.src, kind: "url" });
          else javascript(body, file);
        }
        if (node.tagName === "style") css(body, file);
        if (node.tagName === "link" && attributes.rel === "stylesheet" && attributes.href)
          imports.push({ file, value: attributes.href, kind: "url" });
        for (const child of node.childNodes ?? []) html(child);
      }
      html(parseHtml(source));
    } else javascript(source, file, /\.tsx?$/.test(file));
  }
  function target(file, value) {
    const clean = value.split(/[?#]/)[0];
    return label(
      resolve(
        value.startsWith("/") ? root : dirname(resolve(root, file)),
        value.startsWith("/") ? `.${clean}` : clean,
      ),
    );
  }
  for (const { file, value, line, kind } of imports) {
    // CSS bare filenames are relative; bare JavaScript specifiers are packages.
    const remote = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value);
    const packageImport = kind !== "url" && external(value);
    if (remote || packageImport) {
      if (runtime(file))
        report(file, `Runtime modules cannot import external dependency "${value}"`, line);
      if (
        file.startsWith("react/") &&
        !(value === "react" || value.startsWith("react/") || value.startsWith("@base-ui/react/"))
      )
        report(
          file,
          `React modules may only import React and Base UI primitives: "${value}"`,
          line,
        );
      continue;
    }
    const destination = target(file, value);
    if (destination.startsWith("../")) {
      report(file, `Import escapes the package: ${value}`, line);
      continue;
    }
    if (file.startsWith("react/") && !destination.startsWith("react/"))
      report(file, `React boundary violation: ${file} → ${destination}`, line);
    if (runtime(file)) {
      const allowed = file.startsWith("behaviors/")
        ? destination.startsWith("behaviors/")
        : destination.startsWith("styles/");
      if (!allowed) report(file, `Library boundary violation: ${file} → ${destination}`, line);
      if (
        foundationStyle(file) &&
        destination.startsWith("styles/") &&
        !foundationStyle(destination)
      )
        report(file, `Primitive cannot depend on a composition: ${file} → ${destination}`, line);
    }
    try {
      await access(resolve(root, destination));
    } catch {
      report(file, `Unresolved import "${value}" (${destination})`, line);
    }
    if (!/[?&](?:raw|url)(?:[=&]|$)/.test(value)) graph.get(file).add(destination);
  }
  const active = new Set(),
    complete = new Set(),
    chain = [];
  function visit(file) {
    if (active.has(file)) {
      report(file, `Circular import: ${[...chain.slice(chain.indexOf(file)), file].join(" → ")}`);
      return;
    }
    if (complete.has(file)) return;
    active.add(file);
    chain.push(file);
    for (const dependency of graph.get(file) ?? []) visit(dependency);
    chain.pop();
    active.delete(file);
    complete.add(file);
  }
  for (const file of graph.keys()) visit(file);

  const publicModules = new Set<string>();
  const pkg = await Bun.file(resolve(root, "package.json")).json();
  function publicTargets(value) {
    if (typeof value === "string" && /^\.\/(?:dist\/)?behaviors\/.*\.(?:js|ts)$/.test(value))
      publicModules.add(
        value.startsWith("./dist/") ? value.slice(7).replace(/\.js$/, ".ts") : value.slice(2),
      );
    else if (value && typeof value === "object")
      for (const child of Object.values(value)) publicTargets(child);
  }
  publicTargets(pkg.exports);
  function exportedNames(file, visited = new Set()) {
    if (visited.has(file)) return new Set();
    visited.add(file);
    const names = new Set(exports.get(file) ?? []);
    for (const value of stars.get(file) ?? [])
      for (const name of exportedNames(target(file, value), visited)) names.add(name);
    return names;
  }
  const owners = new Map();
  for (const file of publicModules) {
    for (const name of exportedNames(file)) {
      if (owners.has(name))
        report(
          file,
          `Duplicate public behavior export "${name}" also owned by ${owners.get(name)}`,
        );
      else owners.set(name, file);
    }
  }
  return diagnostics.sort();
}

if (process.argv[1] && import.meta.url === Bun.pathToFileURL(resolve(process.argv[1])).href) {
  const root = Bun.fileURLToPath(new URL("../", import.meta.url));
  const diagnostics = await checkBoundaries(root);
  if (diagnostics.length) {
    console.error(diagnostics.join("\n"));
    process.exitCode = 1;
  } else
    console.log(
      "Runway boundaries passed: imports, cycles, handler keys and public behavior ownership.",
    );
}
