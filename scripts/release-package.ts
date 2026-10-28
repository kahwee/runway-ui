import assert from "node:assert/strict";
import { appendFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";

export const packageName = "@kahwee/runway-ui";
type Package = {
  name: string;
  version: string;
  exports: Record<string, string | { types: string; default: string }>;
  peerDependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

export function releaseIdentity(pkg: Pick<Package, "name" | "version">, tag = "") {
  assert.equal(pkg.name, packageName);
  const number = "(?:0|[1-9][0-9]*)";
  const identifier = "(?:0|[1-9][0-9]*|[0-9]*[A-Za-z-][0-9A-Za-z-]*)";
  assert.match(
    pkg.version,
    new RegExp(`^${number}\\.${number}\\.${number}(?:-${identifier}(?:\\.${identifier})*)?$`),
  );
  if (tag) assert.equal(tag, `v${pkg.version}`, "Tag must exactly match package.json version");
  return {
    name: packageName,
    version: pkg.version,
    distTag: pkg.version.includes("-") ? "next" : "latest",
  };
}

export function checkArchiveFiles(files: Map<string, string>, pkg: Package) {
  for (const path of files.keys()) {
    assert.ok(
      path.startsWith("package/") && !path.split("/").includes("..") && !path.includes("\\"),
      `Unsafe archive path: ${path}`,
    );
  }
  const archived = JSON.parse(files.get("package/package.json") ?? "null");
  assert.deepEqual(archived, pkg, "Archive manifest differs from checked source");
  for (const path of ["LICENSE", "README.md", "index.css", "dist/runway-ui.css"]) {
    assert.ok(files.get(`package/${path}`)?.length, `Missing archive file: ${path}`);
  }
  for (const target of Object.values(pkg.exports)) {
    for (const path of typeof target === "string" ? [target] : [target.types, target.default]) {
      assert.ok(path.startsWith("./") && !path.split("/").includes(".."));
      if (!path.includes("*"))
        assert.ok(files.get(`package/${path.slice(2)}`)?.length, `Missing export: ${path}`);
    }
  }
}

function run(command: string[], cwd: string) {
  const result = Bun.spawnSync(command, { cwd, stdout: "inherit", stderr: "inherit" });
  assert.equal(result.exitCode, 0, `${command[0]} failed`);
}

async function checkConsumer(archive: string, pkg: Package) {
  const directory = await mkdtemp(join(tmpdir(), "runway-release-"));
  try {
    const peers = Object.fromEntries(
      Object.keys(pkg.peerDependencies).map((name) => {
        assert.ok(pkg.devDependencies[name], `No tested peer version: ${name}`);
        return [name, pkg.devDependencies[name]];
      }),
    );
    await Bun.write(
      join(directory, "package.json"),
      JSON.stringify({
        private: true,
        type: "module",
        dependencies: { [packageName]: `file:${resolve(archive)}`, ...peers },
        devDependencies: {
          typescript: pkg.devDependencies.typescript,
          "@types/react": pkg.devDependencies["@types/react"],
          "@types/react-dom": pkg.devDependencies["@types/react-dom"],
        },
      }),
    );
    run([process.execPath, "install", "--ignore-scripts"], directory);
    await Bun.write(
      join(directory, "consumer.ts"),
      `import {createElement} from 'react';\nimport {Button} from '${packageName}/react';\nexport const element = createElement(Button, {disabled:true}, 'Check');\n`,
    );
    run(
      [
        process.execPath,
        "run",
        "--bun",
        "tsc",
        "--noEmit",
        "--strict",
        "--module",
        "NodeNext",
        "--moduleResolution",
        "NodeNext",
        "--target",
        "ES2023",
        "consumer.ts",
      ],
      directory,
    );
    const runtimeExports = Object.entries(pkg.exports)
      .filter(([, value]) => typeof value !== "string")
      .map(([key]) => packageName + key.slice(1));
    const cssExports = Object.entries(pkg.exports)
      .filter(([, value]) => typeof value === "string" && !value.includes("*"))
      .map(([key]) => (key === "." ? packageName : packageName + key.slice(1)));
    await Bun.write(
      join(directory, "smoke.mjs"),
      `import assert from 'node:assert/strict';\nimport {readFile} from 'node:fs/promises';\nimport {createElement} from 'react';\nimport {renderToStaticMarkup} from 'react-dom/server';\nimport {Button} from '${packageName}/react';\nfor (const name of ${JSON.stringify(runtimeExports)}) await import(name);\nfor (const name of ${JSON.stringify(cssExports)}) assert.ok((await readFile(new URL(import.meta.resolve(name)))).length);\nassert.match(renderToStaticMarkup(createElement(Button, {disabled:true}, 'Check')), /disabled/);\n`,
    );
    run([process.execPath, "--no-install", "smoke.mjs"], directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

if (import.meta.main) {
  const pkg = (await Bun.file("package.json").json()) as Package;
  const identity = releaseIdentity(pkg, process.env.RELEASE_TAG ?? "");
  if (process.argv[2] === "identity") {
    if (process.env.GITHUB_OUTPUT)
      await appendFile(
        process.env.GITHUB_OUTPUT,
        `version=${identity.version}\ndist-tag=${identity.distTag}\n`,
      );
    console.log(JSON.stringify(identity));
  } else {
    assert.equal(process.argv[2], "archive");
    const path = process.argv[3];
    assert.ok(path, "Supply the tested archive path");
    const bytes = await Bun.file(path).arrayBuffer();
    const archived = await new Bun.Archive(bytes).files();
    const files = new Map<string, string>();
    for (const [name, file] of archived) files.set(name, await file.text());
    checkArchiveFiles(files, pkg);
    await checkConsumer(path, pkg);
    console.log(
      JSON.stringify({
        ...identity,
        consumer: "passed",
        archiveSha256: new Bun.CryptoHasher("sha256").update(bytes).digest("hex"),
      }),
    );
  }
}
