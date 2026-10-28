import assert from "node:assert/strict";
import test from "node:test";
import { createElement as h } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { Inventory, Meter, Range } from "../react/index.ts";

// Consumer contracts: state, native associations and assistive values must agree.
test("controlled range uses its value and preserves native props and consumer styles", () => {
  const html = render(
    h(Range, {
      label: "Allocation",
      id: "allocation",
      name: "allocation",
      value: 75,
      defaultValue: 25,
      min: 0,
      max: 100,
      step: 5,
      disabled: true,
      style: { accentColor: "rebeccapurple" },
      format: (value) => `${value}%`,
    }),
  );
  assert.match(html, /<label for="allocation">Allocation<\/label>/);
  assert.match(html, /<output for="allocation">75%<\/output>/);
  assert.match(html, /<input[^>]*id="allocation"[^>]*value="75"/);
  assert.match(html, /name="allocation"/);
  assert.match(html, /step="5"/);
  assert.match(html, /disabled=""/);
  assert.match(html, /accent-color:rebeccapurple;--rw-fill:75%/);
});

test("uncontrolled ranges retain defaults and generate distinct label associations", () => {
  const html = render(
    h(
      "div",
      null,
      h(Range, { label: "First", defaultValue: 30 }),
      h(Range, { label: "Second", min: 10 }),
    ),
  );
  const inputs = [...html.matchAll(/<input[^>]*id="([^"]+)"[^>]*value="([^"]+)"/g)];
  assert.equal(inputs.length, 2);
  assert.notEqual(inputs[0][1], inputs[1][1]);
  assert.deepEqual(
    inputs.map((match) => match[2]),
    ["30", "10"],
  );
  for (const [, id] of inputs) {
    assert.ok(html.includes(`<label for="${id}">`));
    assert.ok(html.includes(`<output for="${id}">`));
  }
});

test("inventory exposes one enabled Tab entry even when the first slot is disabled", () => {
  const html = render(
    h(Inventory, {
      columns: 0,
      items: [
        { id: "locked", label: "Locked", disabled: true },
        { id: "seeds", label: "Seeds" },
        { id: "water", label: "Water" },
      ],
    }),
  );
  const buttons = [...html.matchAll(/<button[^>]*>/g)].map(([tag]) => tag);
  assert.match(buttons[0], /tabindex="-1"/);
  assert.match(buttons[1], /tabindex="0"/);
  assert.match(buttons[2], /tabindex="-1"/);
  assert.match(html, /--rw-columns:1/);
});

test("empty and entirely disabled inventories do not offer an unusable Tab entry", () => {
  for (const items of [[], [{ id: "locked", label: "Locked", disabled: true }]]) {
    const html = render(h(Inventory, { items }));
    assert.doesNotMatch(html, /tabindex="0"/);
    assert.match(html, /role="group" aria-label="Inventory"/);
  }
});

test("meter presentation and accessible values share finite, bounded units", () => {
  for (const [value, max, current, limit, percent] of [
    [15, 10, 10, 10, 100],
    [-2, 10, 0, 10, 0],
    [3, 10, 3, 10, 30],
    [20, 0, 20, 100, 20],
    [20, -1, 20, 100, 20],
    [Number.NaN, Number.POSITIVE_INFINITY, 0, 100, 0],
  ]) {
    const html = render(h(Meter, { label: "Reserve", value, max }));
    assert.ok(html.includes(`aria-valuemax="${limit}"`));
    assert.ok(html.includes(`aria-valuenow="${current}"`));
    assert.ok(html.includes(`--rw-value:${percent}%`));
    assert.doesNotMatch(html, /NaN|Infinity/);
  }
});

test("input scopes and remappable hints render server-side with semantic labels and current keys", async () => {
  const { InputScope, InputHints } = await import("../react/index.ts");
  const binding = { id: "next", label: "Next <cycle>", key: "x", ctrlKey: true, onActivate() {} };
  const html = render(
    h(
      InputScope,
      { "aria-label": "Commands", bindings: [binding], gamepad: true },
      h(InputHints, { bindings: [binding] }),
    ),
  );
  assert.match(html, /role="group" aria-label="Commands"/);
  assert.match(html, /data-rw-input-scope=""/);
  assert.match(html, /<kbd class="rw-shortcut">Ctrl\+x<\/kbd>/);
  assert.match(html, /Next &lt;cycle&gt;/);
  assert.doesNotMatch(
    html,
    /data-rw-focus-item|tabindex=/,
    "The scope must not rewrite native Tab order",
  );
});
