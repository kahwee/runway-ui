import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { build } from "vite";
import { Button, Checkbox, Field, Input, Select } from "../react/index.ts";

test("React entry retains Base UI identity for compound primitives", async () => {
  assert.equal(Checkbox, (await import("@base-ui/react/checkbox")).Checkbox);
  assert.equal(Field, (await import("@base-ui/react/field")).Field);
  assert.equal(Select, (await import("@base-ui/react/select")).Select);
});

test("styled controls preserve disabled state, consumer classes and field association", () => {
  const button = renderToStaticMarkup(
    h(
      Button,
      {
        disabled: true,
        className: ({ disabled }) => (disabled ? "consumer-disabled" : "consumer-ready"),
      },
      "Save",
    ),
  );
  assert.match(button, /class="rw-button consumer-disabled"/);
  assert.match(button, /disabled=""/);
  const field = renderToStaticMarkup(
    h(
      Field.Root,
      null,
      h(Field.Label, null, "Name"),
      h(Input, { id: "workspace-name", name: "name", defaultValue: "Orchard" }),
      h(Field.Description, null, "A unique workspace"),
    ),
  );
  assert.equal(
    field.match(/<label[^>]*for="([^"]+)"/)[1],
    field.match(/<input[^>]*id="([^"]+)"/)[1],
  );
  assert.match(field, /class="rw-input"/);
  assert.match(field, /value="Orchard"/);
  // Base UI associates descriptions after mount; real-browser acceptance covers that link.
});

test("React peers are optional and vanilla runtime dependencies remain empty", async () => {
  const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.deepEqual(pkg.dependencies ?? {}, {});
  for (const name of ["react", "react-dom", "@base-ui/react"])
    assert.equal(pkg.peerDependenciesMeta[name].optional, true);
  assert.equal(pkg.exports["./dialog"].default, "./dist/behaviors/dialog.js");
});

test("a Button-only consumer drops unused optional entry exports", async () => {
  const result = await build({
    configFile: false,
    logLevel: "silent",
    build: {
      write: false,
      minify: false,
      lib: {
        entry: new URL("./fixtures/react-button.ts", import.meta.url).pathname,
        formats: ["es"],
      },
      rollupOptions: { external: (id) => /^(react|react-dom)(\/|$)/.test(id) },
    },
  });
  const code = (Array.isArray(result) ? result : [result])
    .flatMap((bundle) => ("output" in bundle ? bundle.output : []))
    .filter((item) => item.type === "chunk")
    .map((item) => item.code)
    .join("\n");
  assert.match(code, /rw-button/);
  const modules = (Array.isArray(result) ? result : [result])
    .flatMap((bundle) => ("output" in bundle ? bundle.output : []))
    .filter((item) => item.type === "chunk")
    .flatMap((chunk) => Object.entries(chunk.modules))
    .filter(([, info]) => (info as { renderedLength: number }).renderedLength > 0)
    .map(([id]) => id);
  assert.ok(
    modules.some((id) => /base-ui.*\/button\//.test(id)),
    "Base UI Button is bundled",
  );
  assert.ok(
    !modules.some((id) => /base-ui.*\/(select|checkbox|field|input)\//.test(id)),
    "Unused primitive implementations are removed",
  );
});
