import assert from "node:assert/strict";
import test from "node:test";
import { parseFragment } from "parse5";
import { historyMarkup } from "../examples/observatory/charts.ts";
import { makeData } from "../examples/observatory/data.ts";

const nodes = (node) => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const attr = (node, name) => node.attrs?.find((item) => item.name === name)?.value;
const text = (node) =>
  nodes(node)
    .filter((item) => item.nodeName === "#text")
    .map((item) => item.value)
    .join("");

test("responsive history preserves all observations and their projected status", () => {
  const data = makeData();
  const tree = nodes(parseFragment(historyMarkup(data, "history")));
  const rows = tree.filter((node) => node.tagName === "tr");
  assert.equal(rows.length, data.values.length + 1);
  for (const [index, row] of rows.slice(1).entries()) {
    const cells = row.childNodes.filter((node) => ["th", "td"].includes(node.tagName));
    assert.deepEqual(cells.map(text), [
      data.labels[index],
      String(data.values[index]),
      index > data.lastObserved ? "Projected" : "Observed",
    ]);
  }
  assert.equal(tree.filter((node) => node.tagName === "li").length, data.values.length);
});

test("long cycle labels and three-digit readings get a named keyboard scroll region", () => {
  const data = makeData({
    scenario: "custom",
    values: [0, 100, null, 40, 50, 60],
    labels: ["First cycle", "Second cycle", "Missing cycle", "Fourth", "Fifth", "Sixth"],
    forecastCount: 1,
  });
  const tree = nodes(parseFragment(historyMarkup(data, "history")));
  const region = tree.find((node) => attr(node, "class") === "rw-history__viewport");
  assert.equal(attr(region, "role"), "region");
  assert.equal(attr(region, "tabindex"), "0");
  assert.equal(attr(region, "aria-label"), "Scrollable output chart");
  assert.ok(tree.some((node) => node.tagName === "td" && text(node) === "Missing"));
  assert.ok(tree.some((node) => node.tagName === "strong" && text(node).startsWith("100")));
});

test("chart labels remain text in both the plotted series and exact-data table", () => {
  const label = '<img src=x onerror="alert(1)">';
  const data = makeData({
    scenario: "custom",
    values: [10, 20, 30, 40, 50, 60],
    labels: [label, "Second", "Third", "Fourth", "Fifth", "Sixth"],
    forecastCount: 0,
  });
  const tree = nodes(parseFragment(historyMarkup(data, "history")));
  assert.equal(
    tree.some((node) => node.tagName === "img"),
    false,
  );
  assert.ok(tree.some((node) => node.tagName === "th" && text(node) === label));
  assert.ok(tree.some((node) => attr(node, "class") === "rw-category" && text(node) === label));
});
