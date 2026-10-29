import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { build } from "vite";
import { Progress } from "../react/index.ts";

test("React and chart peers are required and runtime dependencies remain empty", async () => {
  const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.deepEqual(pkg.dependencies ?? {}, {});
  for (const name of ["react", "react-dom", "@base-ui/react", "@tanstack/charts"]) {
    assert.ok(pkg.peerDependencies[name], `${name} is a peer`);
    assert.equal(pkg.peerDependenciesMeta?.[name]?.optional, undefined);
  }
  assert.equal(pkg.exports["./dialog"].default, "./dist/behaviors/dialog.js");
});

test("a Button-only bundle drops unrelated Runway components", async () => {
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
    !modules.some((id) =>
      /\/react\/(meter|animated-number|confetti|toast|chart|input-scope|input-hints|gamepad-input)\.ts$/.test(
        id,
      ),
    ),
    "Unrelated Runway components are removed",
  );
});

test("native progress keeps its name, units, indeterminate state and consumer props", () => {
  const progress = renderToStaticMarkup(
    h(Progress, {
      value: 3,
      max: 10,
      "aria-label": "Experiment",
      "aria-valuetext": "3 of 10 workdays",
      className: "consumer-progress",
      id: "experiment-progress",
    }),
  );
  assert.match(progress, /<progress/);
  assert.match(progress, /value="3"/);
  assert.match(progress, /max="10"/);
  assert.match(progress, /aria-label="Experiment"/);
  assert.match(progress, /aria-valuetext="3 of 10 workdays"/);
  assert.match(progress, /class="rw-progress consumer-progress"/);
  assert.match(progress, /id="experiment-progress"/);
  const unknown = renderToStaticMarkup(h(Progress, { "aria-label": "Loading" }));
  assert.doesNotMatch(unknown, / value=|aria-valuenow=/);
});

test("component ownership refactors retain every supported React runtime export", async () => {
  const entry = await import("@kahwee/runway-ui/react");
  const supported = [
    "AnimatedNumber",
    "Badge",
    "Button",
    "Chart",
    "ChartCard",
    "Checkbox",
    "CommandBar",
    "Confetti",
    "ControlConsole",
    "Dialog",
    "Dossier",
    "DossierList",
    "Field",
    "FolioTabs",
    "Input",
    "Inventory",
    "Meter",
    "Panel",
    "Progress",
    "Range",
    "Resource",
    "Runway",
    "Select",
    "Sheet",
    "ToastProvider",
    "cx",
    "defineChart",
    "useToasts",
  ];
  for (const name of supported)
    assert.ok(Object.hasOwn(entry, name), `Missing public export: ${name}`);
});

test("menus render Base UI triggers with Runway classes and the chosen label", async () => {
  const { SelectMenu, ComboboxMenu, Popover } = await import("../react/index.ts");
  const options = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Beta" },
  ];
  const html = renderToStaticMarkup(
    h(
      "div",
      null,
      h(SelectMenu, { options, defaultValue: "b", "aria-label": "Letter" }),
      h(ComboboxMenu, { options, "aria-label": "Search letters" }),
      h(Popover, { trigger: "Help", children: "Body" }),
    ),
  );
  assert.match(html, /rw-menu-trigger/);
  assert.match(html, /Beta/);
  assert.match(html, /rw-combobox-input/);
  assert.match(html, /rw-button/);
});
