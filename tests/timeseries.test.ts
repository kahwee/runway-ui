import assert from "node:assert/strict";
import test from "node:test";
import { mountHistoryWindow } from "../behaviors/timeseries.ts";

// Small DOM boundary fixture; browser checks cover native controls and actual markup.
function fixture(run) {
  const original = Object.fromEntries(
    ["Element", "requestAnimationFrame", "cancelAnimationFrame"].map((name) => [
      name,
      globalThis[name],
    ]),
  );
  const frames = new Map();
  let sequence = 0;
  class Root {
    innerHTML = "";
    fields = new Map();
    querySelector(selector) {
      if (!this.fields.has(selector))
        this.fields.set(selector, { style: {}, querySelector: () => null, addEventListener() {} });
      return this.fields.get(selector);
    }
    addEventListener() {}
    replaceChildren() {
      this.innerHTML = "";
    }
  }
  globalThis.Element = Root as unknown as typeof Element;
  globalThis.requestAnimationFrame = (callback) => {
    frames.set(++sequence, callback);
    return sequence;
  };
  globalThis.cancelAnimationFrame = (id) => frames.delete(id);
  try {
    run(new Root(), frames);
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete globalThis[key];
      else globalThis[key] = value;
    }
  }
}

test("empty histories have finite geometry, honest status and disabled controls", () =>
  fixture((root) => {
    const view = mountHistoryWindow(root, { values: [], labels: [] });
    assert.deepEqual(view.state, { start: 0, size: 0, end: 0, total: 0 });
    assert.equal(root.fields.get(".rw-timeline__status").textContent, "No observations");
    assert.doesNotMatch(root.fields.get(".rw-timeline__window").style.cssText, /NaN|Infinity/);
    assert.equal(root.fields.get("input[type=range]").disabled, true);
    assert.equal(root.fields.get("select").disabled, true);
    view.setWindow(0);
    view.destroy();
    view.setWindow(0, 7);
    assert.equal(root.innerHTML, "");
  }));

test("invalid timeline data is rejected before replacing host contents", () =>
  fixture((root) => {
    root.innerHTML = "preserved";
    for (const override of [
      { values: [1, NaN] },
      { labels: ["one", ""] },
      { start: 0.5 },
      { overviewBins: 0 },
      { minimum: 1 },
      { annotations: [{ index: 3, title: "Invalid", description: "Out of range" }] },
    ]) {
      assert.throws(() =>
        mountHistoryWindow(root, { values: [1, 2], labels: ["one", "two"], ...override }),
      );
      assert.equal(root.innerHTML, "preserved");
    }
  }));

test("window bounds stay integral and destroyed views cannot redraw", () =>
  fixture((root) => {
    const view = mountHistoryWindow(root, {
      values: [1, 2, 3],
      labels: ["one", "two", "three"],
      windowSize: 1,
    });
    view.setWindow(999, 2);
    assert.deepEqual(view.state, { start: 1, size: 2, end: 3, total: 3 });
    for (const args of [
      [0.5, 2],
      [-1, 2],
      [0, 0],
      [0, 367],
    ])
      assert.throws(() => view.setWindow(...(args as [number, number])), RangeError);
    view.destroy();
    view.destroy();
    view.setWindow(0, 1);
    assert.equal(root.innerHTML, "");
  }));
