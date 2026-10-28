import assert from "node:assert/strict";
import { appendFile } from "node:fs/promises";

export const packageName = "@kahwee/runway-ui";
type Package = {
  name: string;
  version: string;
  exports: Record<string, string | { types: string; default: string }>;
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
    console.log(
      JSON.stringify({
        ...identity,
        manifestAndExports: "passed",
        archiveSha256: new Bun.CryptoHasher("sha256").update(bytes).digest("hex"),
      }),
    );
  }
}
