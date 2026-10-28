import assert from "node:assert/strict";
import test from "node:test";
import { checkArchiveFiles, packageName, releaseIdentity } from "../scripts/release-package.ts";

test("release tags match exactly and prereleases never use latest", () => {
  assert.equal(
    releaseIdentity({ name: packageName, version: "1.2.3" }, "v1.2.3").distTag,
    "latest",
  );
  assert.equal(
    releaseIdentity({ name: packageName, version: "0.6.0-beta.2" }, "v0.6.0-beta.2").distTag,
    "next",
  );
  assert.equal(releaseIdentity({ name: packageName, version: "1.0.0-rc.1" }).distTag, "next");
  for (const version of ["01.0.0", "1.0", "1.0.0-01", "1.0.0+build", "1.0.0;echo bad"])
    assert.throws(() => releaseIdentity({ name: packageName, version }));
  assert.throws(() => releaseIdentity({ name: "runway-ui", version: "1.0.0" }));
  assert.throws(() => releaseIdentity({ name: packageName, version: "1.0.0" }, "v1.0.1"));
});

test("archive gate requires actual exported JavaScript and declarations", () => {
  const pkg = {
    name: packageName,
    version: "1.0.0",
    exports: {
      ".": "./index.css",
      "./react": { types: "./dist/react/index.d.ts", default: "./dist/react/index.js" },
    },
    peerDependencies: {},
    devDependencies: {},
  };
  const files = new Map([
    ["package/package.json", JSON.stringify(pkg)],
    ...[
      "LICENSE",
      "README.md",
      "index.css",
      "dist/runway-ui.css",
      "dist/react/index.d.ts",
      "dist/react/index.js",
    ].map((path) => [`package/${path}`, "content"] as [string, string]),
  ]);
  checkArchiveFiles(files, pkg);
  files.delete("package/dist/react/index.js");
  assert.throws(() => checkArchiveFiles(files, pkg), /Missing export/);
  files.set("package/dist/react/index.js", "content");
  files.set("package/../secret", "x");
  assert.throws(() => checkArchiveFiles(files, pkg), /Unsafe/);
});

test("publication is tag-only, no environment, and OIDC belongs only to publishing", async () => {
  const workflow = Bun.YAML.parse(
    await Bun.file(new URL("../.github/workflows/publish.yml", import.meta.url)).text(),
  ) as any;
  assert.deepEqual(workflow.permissions, { contents: "read" });
  assert.deepEqual(workflow.on.push.tags, ["v*"]);
  assert.equal(workflow.jobs.validate.permissions, undefined);
  assert.deepEqual(workflow.jobs.publish.permissions, { contents: "read", "id-token": "write" });
  assert.equal(workflow.jobs.publish.environment, undefined);
  assert.match(workflow.jobs.publish.if, /refs\/tags\/v/);
  assert.deepEqual(workflow.jobs.publish.needs, ["validate", "browser"]);
  assert.equal(
    workflow.jobs.browser.needs,
    undefined,
    "Browser and package checks start independently",
  );
  assert.deepEqual(workflow.jobs.browser.strategy.matrix.width, [320, 390, 768, 1366, 1440]);
  assert.equal(workflow.jobs.browser.env.PLAYWRIGHT_CHROMIUM_CHANNEL, "chrome");
  const validation = workflow.jobs.validate.steps.map((step: any) => step.run ?? "").join("\n");
  assert.doesNotMatch(validation, /build-site|check-pages|playwright install/);
  const browser = workflow.jobs.browser.steps.map((step: any) => step.run ?? "").join("\n");
  assert.match(browser, /bun run check-pages/);
  assert.doesNotMatch(browser, /playwright install/);
  for (const job of Object.values(workflow.jobs) as any[])
    for (const step of job.steps) if (step.uses) assert.match(step.uses, /@[a-f0-9]{40}$/);
  const commands = workflow.jobs.publish.steps.map((s: any) => s.run ?? "").join("\n");
  assert.match(commands, /sha256sum -c/);
  assert.match(commands, /npm publish .*package\.tgz/);
  assert.match(commands, /--ignore-scripts/);
  assert.doesNotMatch(commands, /npm (?:version|dist-tag)|git (?:push|tag)/);
});
