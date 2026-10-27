import assert from "node:assert/strict";
import test from "node:test";
import { bindRanges } from "../behaviors/forms.js";

// Model only the DOM boundary; EventTarget/AbortController remain native Node APIs.
// Browser checks exercise real input, focus and disabled keyboard behavior.
function fixture(run) {
  const saved = { HTMLInputElement: globalThis.HTMLInputElement, CSS: globalThis.CSS };
  class Input {
    id = "level";
    min = "0";
    max = "100";
    value = "40";
    disabled = false;
    properties = new Map();
    style = {
      setProperty: (key, value) => this.properties.set(key, value),
      getPropertyValue: (key) => this.properties.get(key) ?? "",
      removeProperty: (key) => this.properties.delete(key),
    };
    matches(selector) {
      return selector === "input[type=range].rw-range";
    }
  }
  const input = new Input();
  const output = { value: "" };
  const root = Object.assign(new EventTarget(), {
    querySelectorAll: () => [input],
    querySelector: () => output,
  });
  const emitInput = () => {
    const event = new Event("input", { bubbles: true });
    Object.defineProperty(event, "target", { value: input });
    root.dispatchEvent(event);
  };
  globalThis.HTMLInputElement = Input;
  globalThis.CSS = { escape: (id) => id };
  try {
    run({ root, input, output, emitInput });
  } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete globalThis[key];
      else globalThis[key] = value;
    }
  }
}

test("retired range cleanup preserves replacement fill, output and listener ownership", () =>
  fixture(({ root, input, output, emitInput }) => {
    let retiredCalls = 0;
    let activeCalls = 0;
    const retired = bindRanges(root, {
      format: (value) => {
        retiredCalls++;
        return `Retired: ${value}`;
      },
    });
    retired.destroy();
    assert.equal(input.style.getPropertyValue("--rw-fill"), "");
    const active = bindRanges(root, {
      format: (value) => {
        activeCalls++;
        return `Active: ${value}`;
      },
    });
    input.value = "41";
    emitInput();
    retired.destroy();
    assert.equal(input.style.getPropertyValue("--rw-fill"), "41%");
    assert.equal(output.value, "Active: 41");
    assert.equal(retiredCalls, 1);
    assert.equal(activeCalls, 2);
    input.value = "42";
    emitInput();
    assert.equal(input.style.getPropertyValue("--rw-fill"), "42%");
    assert.equal(output.value, "Active: 42");
    assert.equal(activeCalls, 3);
    active.destroy();
    input.value = "43";
    emitInput();
    assert.equal(input.style.getPropertyValue("--rw-fill"), "");
    assert.equal(output.value, "Active: 42");
    assert.equal(retiredCalls, 1);
    assert.equal(activeCalls, 3);
  }));

test("range teardown preserves native value, disabled state and unrelated styles", () =>
  fixture(({ root, input, output, emitInput }) => {
    input.min = "10";
    input.max = "50";
    input.value = "30";
    input.disabled = true;
    input.style.setProperty("color", "purple");
    const binding = bindRanges(root);
    assert.equal(output.value, "30");
    assert.equal(input.style.getPropertyValue("--rw-fill"), "50%");
    assert.equal(input.value, "30");
    assert.equal(input.disabled, true);
    binding.destroy();
    binding.destroy();
    assert.equal(input.style.getPropertyValue("--rw-fill"), "");
    assert.equal(input.style.getPropertyValue("color"), "purple");
    assert.equal(input.value, "30");
    assert.equal(input.disabled, true);
    input.value = "40";
    emitInput();
    assert.equal(output.value, "30");
  }));
