import assert from "node:assert/strict";
import test from "node:test";
import { matchesBinding, bindingKeys, type InputBinding } from "../react/input-bindings.ts";
import { gamepadCommands, createGamepadRepeater } from "../react/gamepad-input.ts";
import { nextFocusIndex } from "../react/input-navigation.ts";

const binding: InputBinding = { id: "next", label: "Next", key: "n", onActivate() {} };
const key = (overrides = {}) =>
  ({
    key: "N",
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false,
    isComposing: false,
    ...overrides,
  }) as KeyboardEvent;

test("bindings require exact modifiers and reject held or composing keys", () => {
  assert.equal(matchesBinding(key(), binding), true);
  for (const overrides of [
    { ctrlKey: true },
    { altKey: true },
    { metaKey: true },
    { shiftKey: true },
    { repeat: true },
    { isComposing: true },
    { key: "x" },
  ])
    assert.equal(matchesBinding(key(overrides), binding), false);
  assert.equal(matchesBinding(key({ ctrlKey: true }), { ...binding, ctrlKey: true }), true);
  assert.equal(bindingKeys({ ...binding, ctrlKey: true, shiftKey: true }), "Ctrl+Shift+n");
  assert.equal(bindingKeys({ ...binding, key: " " }), "Space");
  assert.equal(
    matchesBinding(key({ key: "Tab" }), { ...binding, key: "Tab" }),
    false,
    "Tab is always reserved for native focus",
  );
});

test("directional navigation preserves disabled grid positions and bounded/wrapped movement", () => {
  const slots = [true, false, true, true, true, true];
  assert.equal(nextFocusIndex(slots, 0, "right", 3, false), 2);
  assert.equal(nextFocusIndex(slots, 0, "down", 3, false), 3);
  assert.equal(nextFocusIndex(slots, 4, "up", 3, false), 4);
  assert.equal(nextFocusIndex(slots, 5, "right", 3, false), 5);
  assert.equal(nextFocusIndex(slots, 5, "right", 3, true), 0);
  assert.equal(nextFocusIndex(slots, 3, "first", 3, false), 0);
  assert.equal(nextFocusIndex(slots, 0, "last", 3, false), 5);
  assert.equal(nextFocusIndex([false, false], 0, "right", 0, true), -1);
  assert.equal(nextFocusIndex([], 0, "first", 1, false), -1);
  assert.equal(nextFocusIndex(slots, 0, "down", Number.NaN, false), 2);
});

test("standard gamepad mapping has a dead zone and never guesses unmapped hardware", () => {
  const pad = {
    mapping: "standard" as const,
    axes: [0.5, -0.8],
    buttons: Array.from({ length: 16 }, (_, i) => ({
      pressed: i === 0,
      value: i === 0 ? 1 : 0,
      touched: false,
    })),
  };
  assert.deepEqual([...gamepadCommands(pad)], ["up", "activate"]);
  assert.deepEqual([...gamepadCommands({ ...pad, mapping: "" })], []);
  const buttons = Array.from({ length: 16 }, (_, index) => ({
    pressed: index === 14,
    touched: false,
    value: index === 14 ? 1 : 0,
  }));
  assert.deepEqual(
    [...gamepadCommands({ ...pad, axes: [0.9, 0], buttons })],
    ["left"],
    "D-pad intent takes priority over the stick",
  );
  assert.deepEqual([...gamepadCommands({ ...pad, axes: [0.8, 0], buttons: [] })], ["right"]);
});

test("gamepad activation is edge-triggered and held movement repeats at a bounded cadence", () => {
  const repeat = createGamepadRepeater();
  assert.deepEqual(repeat(new Set(["activate"]), 0), [], "buttons held on focus never activate");
  assert.deepEqual(repeat(new Set(), 10), []);
  assert.deepEqual(repeat(new Set(["activate", "right"]), 20), ["activate", "right"]);
  assert.deepEqual(repeat(new Set(["activate", "right"]), 100), []);
  assert.deepEqual(repeat(new Set(["activate", "right"]), 370), ["right"]);
  assert.deepEqual(repeat(new Set(["activate", "right"]), 400), []);
  assert.deepEqual(repeat(new Set(["activate", "right"]), 490), ["right"]);
  assert.deepEqual(
    repeat(new Set(["activate", "right"]), 5000),
    ["right"],
    "a delayed frame emits no burst",
  );
});
