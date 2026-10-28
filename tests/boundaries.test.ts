import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { checkBoundaries } from "../scripts/check-boundaries.ts";

async function fixture(t, files: Record<string, string>, exports = {}) {
  const root = await mkdtemp(join(tmpdir(), "runway-boundaries-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const entries = {
    "package.json": JSON.stringify({ type: "module", exports }),
    ...files,
  };
  await Promise.all(
    Object.entries(entries).map(async ([name, contents]) => {
      const path = join(root, name);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, contents);
    }),
  );
  return root;
}

async function problems(t, files: Record<string, string>, exports = {}) {
  return checkBoundaries(await fixture(t, files, exports));
}

function contains(diagnostics, pattern) {
  assert.ok(diagnostics.length > 0, "Expected a boundary violation");
  assert.match(diagnostics.join("\n"), pattern);
}

test("valid runtime modules, declarations and CSS compositions remain independent of hosts", async (t) => {
  const diagnostics = await problems(
    t,
    {
      "behaviors/navigation.ts": 'export const move = () => "left";',
      "behaviors/navigation.d.ts": 'export type Direction = "left";',
      "behaviors/inventory.ts":
        'import { move } from "./navigation.ts"; export const inventory = () => move();',
      "behaviors/inventory.d.ts":
        'import type { Direction } from "./navigation.ts"; export interface Inventory { move(direction: Direction): void; }',
      "styles/base.css": '.rw-card { background-image: url("./missing-art.svg"); }',
      "styles/panel.css": '@import url("./base.css"); .rw-panel { display: grid; }',
      "index.css": '@import url("./styles/panel.css");',
      "examples/demo.js": 'import { inventory } from "../behaviors/inventory.ts"; inventory();',
      "stories/demo.stories.js":
        'import { inventory } from "../behaviors/inventory.ts"; export const Demo = inventory;',
    },
    {
      ".": "./index.css",
      "./navigation": {
        types: "./behaviors/navigation.d.ts",
        default: "./behaviors/navigation.ts",
      },
      "./inventory": { types: "./behaviors/inventory.d.ts", default: "./behaviors/inventory.ts" },
    },
  );
  assert.deepEqual(diagnostics, []);
});

test("runtime modules cannot import examples, stories or an application entrypoint", async (t) => {
  for (const target of ["examples/demo.js", "stories/demo.stories.js", "app.ts"]) {
    const diagnostics = await problems(t, {
      "behaviors/control.js": `import "../${target}";`,
      [target]: "export const host = true;",
    });
    contains(diagnostics, /behaviors\/control\.js/);
    contains(diagnostics, new RegExp(target.replaceAll(".", "\\.")));
  }
});

test("runtime dependencies cannot bypass boundaries through reexports or dynamic imports", async (t) => {
  for (const statement of [
    'export { host } from "../examples/demo.js";',
    'export * from "../examples/demo.js";',
    'export const load = () => import("../examples/demo.js");',
  ]) {
    const diagnostics = await problems(t, {
      "behaviors/control.js": statement,
      "examples/demo.js": "export const host = true;",
    });
    contains(diagnostics, /examples\/demo\.js/);
  }
  contains(
    await problems(t, {
      "behaviors/control.js": 'import helper from "third-party"; export const control = helper;',
    }),
    /third-party/,
  );
});

test("component styles cannot import demo styles or the root composition", async (t) => {
  for (const target of ["examples/demo.css", "index.css"]) {
    const diagnostics = await problems(t, {
      "styles/control.css": `@import "../${target}";`,
      [target]: ".demo { color: red; }",
    });
    contains(diagnostics, /styles\/control\.css/);
  }
});

test("missing static, dynamic, reexport and declaration dependencies fail with their paths", async (t) => {
  for (const [name, source] of [
    ["behaviors/control.js", 'import "./missing.js";'],
    ["behaviors/control.js", 'export const load = () => import("./missing.js");'],
    ["behaviors/control.js", 'export * from "./missing.js";'],
    [
      "behaviors/control.d.ts",
      'import type { Missing } from "./missing.js"; export type Control = Missing;',
    ],
    ["styles/control.css", '@import url("./missing.css");'],
  ]) {
    contains(await problems(t, { [name]: source }), /missing\.(?:js|css)/);
  }
});

test("JavaScript and CSS import cycles report the cycle path", async (t) => {
  for (const files of [
    {
      "behaviors/a.js": 'export { b } from "./b.js"; export const a = 1;',
      "behaviors/b.js": 'export const b = () => import("./a.js");',
    },
    {
      "styles/a.css": '@import url("./b.css");',
      "styles/b.css": '@import "./a.css";',
    },
  ]) {
    const diagnostics = await problems(t, files);
    contains(diagnostics, /cycle|circular/i);
    contains(diagnostics, /a\.(?:js|css)/);
    contains(diagnostics, /b\.(?:js|css)/);
  }
});

test("duplicate handler keys and computed literal keys cannot silently overwrite actions", async (t) => {
  for (const source of [
    "export const actions = { save() {}, save() {} };",
    'export const actions = { save: () => 1, ["save"]: () => 2 };',
    "export const actions = { get save() { return 1; }, get save() { return 2; } };",
  ]) {
    const diagnostics = await problems(t, { "behaviors/control.js": source });
    contains(diagnostics, /duplicate/i);
    contains(diagnostics, /save/);
  }
});

test("getter/setter pairs and action names in independent maps are valid", async (t) => {
  assert.deepEqual(
    await problems(t, {
      "behaviors/control.js": `
      export const first = { save() {} };
      export const second = { save() {} };
      export const state = { get value() { return 1; }, set value(next) { void next; } };
    `,
    }),
    [],
  );
});

test("public behavior entrypoints cannot export the same operation under competing owners", async (t) => {
  const diagnostics = await problems(
    t,
    {
      "behaviors/first.js": "export function bindControl() {}",
      "behaviors/second.js": "export const bindControl = () => {};",
    },
    {
      "./first": "./behaviors/first.js",
      "./second": { default: "./behaviors/second.js" },
    },
  );
  contains(diagnostics, /duplicate/i);
  contains(diagnostics, /bindControl/);
});

test("comments and strings that resemble imports or action maps are not dependencies", async (t) => {
  assert.deepEqual(
    await problems(t, {
      "behaviors/control.js": `
      // import "../examples/missing.js";
      export const description = 'import("./missing.js")';
      export const markup = '<button data-action="save">Save</button>';
      export const example = '{ save() {}, save() {} }';
    `,
      "styles/control.css": '/* @import "./missing.css"; */ .rw-card { content: "@import"; }',
    }),
    [],
  );
});

test("literal Map registries reject duplicate keys but preserve JavaScript key identity", async (t) => {
  contains(
    await problems(t, {
      "behaviors/control.js":
        'export const actions = new Map([["save", () => 1], ["save", () => 2]]);',
    }),
    /duplicate/i,
  );
  assert.deepEqual(
    await problems(t, {
      "behaviors/control.js": 'export const actions = new Map([[1, () => 1], ["1", () => 2]]);',
    }),
    [],
  );
});

test("inline HTML modules participate in dependency checks", async (t) => {
  contains(
    await problems(t, {
      "examples/demo.html": '<script type="module">import "./missing.js";</script>',
    }),
    /missing\.js/,
  );
  assert.deepEqual(
    await problems(t, {
      "examples/demo.html":
        '<!-- <script type="module">import "./missing-commented.js";</script> --><script type="module">import "host-framework";</script>',
    }),
    [],
  );
});

test("primitive implementation styles cannot import compositions", async (t) => {
  for (const target of [
    "workspace.css",
    "studio/season-cover.css",
    "observatory/workspace.css",
    "patterns/dock.css",
  ]) {
    const diagnostics = await problems(t, {
      "styles/primitives.css": '@import "./fields/base.css";',
      "styles/fields/base.css": `@import "../${target}";`,
      [`styles/${target}`]: ".rw-composition { display: grid; }",
    });
    contains(diagnostics, /Primitive cannot depend on a composition/);
  }
});

test("compositions can assemble independent panel and control primitives", async (t) => {
  assert.deepEqual(
    await problems(t, {
      "styles/tokens.css": ".rw-ui { --rw-space: 14px; }",
      "styles/panels.css": '@import "./tokens.css";',
      "styles/controls.css": '@import "./tokens.css";',
      "styles/workspace.css": '@import "./panels.css"; @import "./controls.css";',
    }),
    [],
  );
});

test("optional React layer allows primitives but cannot enter vanilla or depend on stories", async (t) => {
  assert.deepEqual(
    await problems(t, {
      "react/index.ts": 'export { Field } from "@base-ui/react/field";',
    }),
    [],
  );
  contains(
    await problems(t, {
      "behaviors/native.js": 'import "../react/index.ts";',
      "react/index.ts": 'export { Field } from "@base-ui/react/field";',
    }),
    /Library boundary violation/,
  );
  contains(
    await problems(t, {
      "react/index.ts": 'import "../stories/demo.js";',
      "stories/demo.js": "export const demo = true;",
    }),
    /React boundary violation/,
  );
  contains(
    await problems(t, {
      "react/index.ts": 'import "some-app";',
    }),
    /React modules may only import/,
  );
});

test("React entry points re-export owners and implementations cannot depend on the barrel", async (t) => {
  assert.deepEqual(
    await problems(t, {
      "react/index.ts": '"use client"; export { Button } from "./button.ts";',
      "react/button.ts": "export const Button = () => null;",
    }),
    [],
  );
  contains(
    await problems(t, {
      "react/index.ts": "export function Button() { return null; }",
    }),
    /React entry point must only re-export/,
  );
  contains(
    await problems(t, {
      "react/index.ts": 'export { Field } from "@base-ui/react/field";',
      "react/button.ts": 'import { Field } from "./index.ts"; export { Field };',
    }),
    /import component owners, not the public barrel/,
  );
});

test("CSS aggregate entries cannot accumulate component implementations", async (t) => {
  for (const name of ["charts", "instruments", "feedback", "forms"]) {
    contains(
      await problems(t, {
        [`styles/${name}.css`]: "@layer runway-ui.patterns { .rw-example { display: grid; } }",
      }),
      /CSS aggregate must contain imports only/,
    );
    assert.deepEqual(
      await problems(t, {
        [`styles/${name}.css`]: `@import url("./${name}/owner.css");`,
        [`styles/${name}/owner.css`]:
          "@layer runway-ui.patterns { .rw-example { display: grid; } }",
      }),
      [],
    );
  }
});
