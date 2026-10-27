import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";

const source = (await readFile(new URL("../docs/docs.js", import.meta.url), "utf8"))
  .replace('import { bindDialog } from "../behaviors/dialog.js";', "")
  .replace('import { catalog } from "./catalog.js";', "");

// Execute the actual docs entry point. This small DOM double isolates navigation;
// native fragment scrolling, focus and IME handling are also checked in Chromium.
function fixture() {
  const ids = new Map();
  const location = { hash: "#getting-started" };
  let activeElement,
    navigations = 0;
  class Element {
    constructor(tag = "div") {
      this.tagName = tag.toUpperCase();
      this.children = [];
      this.dataset = {};
      this.listeners = new Map();
      this.attributes = new Map();
      this.value = "studio";
      this.checked = false;
    }
    append(...children) {
      this.children.push(...children);
    }
    setAttribute(key, value) {
      this.attributes.set(key, value);
    }
    toggleAttribute(key, enabled) {
      if (enabled) this.setAttribute(key, "");
      else this.attributes.delete(key);
    }
    addEventListener(type, listener) {
      this.listeners.set(type, listener);
    }
    querySelector(selector) {
      for (const child of this.children) {
        if (child.tagName?.toLowerCase() === selector) return child;
        const found = child.querySelector?.(selector);
        if (found) return found;
      }
      return null;
    }
    focus(options) {
      activeElement = this;
      this.focusOptions = options;
    }
    click() {
      location.hash = this.href;
      navigations++;
    }
    fire(type, properties = {}) {
      const event = {
        key: "",
        isComposing: false,
        keyCode: 0,
        defaultPrevented: false,
        preventDefault() {
          this.defaultPrevented = true;
        },
        ...properties,
      };
      this.listeners.get(type)?.(event);
      return event;
    }
  }
  const document = {
    querySelector(selector) {
      if (!ids.has(selector)) ids.set(selector, new Element());
      return ids.get(selector);
    },
    createElement: (tag) => new Element(tag),
  };
  const catalog = [
    { id: "button", name: "Button", description: "An action", options: [], snippet: "button" },
    {
      id: "dialog",
      name: "Dialog",
      description: "A shared decision",
      options: [],
      snippet: "dialog",
    },
    {
      id: "inventory",
      name: "Inventory",
      description: "A shared collection",
      options: [],
      snippet: "inventory",
    },
  ];
  runInNewContext(source, {
    document,
    catalog,
    bindDialog: () => ({ refresh() {}, open() {} }),
    requestAnimationFrame: (callback) => callback(),
  });
  const input = ids.get("#search");
  input.value = "";
  input.focus();
  input.fire("input");
  const type = (query) => {
    input.value = query;
    input.fire("input");
  };
  return {
    input,
    type,
    location,
    ids,
    get active() {
      return activeElement;
    },
    get navigations() {
      return navigations;
    },
  };
}

test("typing filters without moving focus or navigating", () => {
  const f = fixture();
  f.type("dialog");
  assert.equal(f.ids.get("#result-count").textContent, "1 of 3 components");
  assert.equal(f.active, f.input);
  assert.equal(f.location.hash, "#getting-started");
  assert.equal(f.navigations, 0);
});

test("explicit Enter uses the first visible result's existing permalink and preserves query", () => {
  const f = fixture();
  f.type("  DiALoG  ");
  const event = f.input.fire("keydown", { key: "Enter" });
  assert.ok(event.defaultPrevented);
  assert.equal(f.location.hash, "#component-dialog");
  assert.equal(f.active.attributes.get("aria-label"), "Link to Dialog");
  assert.equal(f.active.focusOptions.preventScroll, true);
  assert.equal(f.input.value, "  DiALoG  ");
  assert.equal(f.navigations, 1);
});

test("multiple matches use catalogue order and repeated queries never select a hidden prior result", () => {
  const f = fixture();
  f.type("shared");
  f.input.fire("keydown", { key: "Enter" });
  assert.equal(f.location.hash, "#component-dialog");
  f.input.focus();
  f.type("inventory");
  f.input.fire("keydown", { key: "Enter" });
  assert.equal(f.location.hash, "#component-inventory");
  assert.equal(f.active.attributes.get("aria-label"), "Link to Inventory");
});

test("IME Enter and other keys cannot navigate", () => {
  const f = fixture();
  f.type("dialog");
  for (const properties of [
    { key: "Enter", isComposing: true },
    { key: "Enter", keyCode: 229 },
    { key: "ArrowDown" },
  ]) {
    assert.equal(f.input.fire("keydown", properties).defaultPrevented, false);
    assert.equal(f.active, f.input);
    assert.equal(f.navigations, 0);
  }
});

test("empty and unmatched queries keep focus, anchors and zero-result feedback", () => {
  const f = fixture();
  for (const query of ["", "  ", "not-a-component"]) {
    f.type(query);
    assert.equal(f.input.fire("keydown", { key: "Enter" }).defaultPrevented, false);
    assert.equal(f.active, f.input);
    assert.equal(f.location.hash, "#getting-started");
    assert.equal(f.navigations, 0);
  }
  assert.equal(f.ids.get("#result-count").textContent, "0 of 3 components");
  assert.equal(f.ids.get("#no-results").hidden, false);
});
