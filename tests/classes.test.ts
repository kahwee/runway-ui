import assert from "node:assert/strict";
import test from "node:test";
import { cx, stateClasses } from "../react/classes.ts";

test("Runway class composition retains base classes for both plain and state-dependent consumers", () => {
  assert.equal(cx("rw-button", undefined, false, "wide"), "rw-button wide");
  assert.equal(stateClasses("rw-input", "wide"), "rw-input wide");
  const classes = stateClasses("rw-button", (state: { disabled: boolean }) =>
    state.disabled ? "unavailable" : undefined,
  );
  assert.equal(typeof classes, "function");
  assert.equal(
    (classes as (state: { disabled: boolean }) => string)({ disabled: true }),
    "rw-button unavailable",
  );
  assert.equal(
    (classes as (state: { disabled: boolean }) => string)({ disabled: false }),
    "rw-button",
  );
});
