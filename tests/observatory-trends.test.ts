import assert from "node:assert/strict";
import test from "node:test";
import { parseFragment } from "parse5";
import { trendMarkup } from "../examples/observatory/charts.ts";

function nodes(node) {
  return [node, ...(node.childNodes ?? []).flatMap(nodes)];
}
for (const [values, icon, text] of [
  [[10, 12], "arrow-up", "2 more than previous"],
  [[12, 10], "arrow-down", "2 fewer than previous"],
  [[10, 10], "arrow-right", "0 change than previous"],
  [[null, 10], null, "Comparison unavailable"],
]) {
  test(`trend renders ${icon ?? "missing comparison"} without exposing markup`, () => {
    const tree = nodes(
      parseFragment(trendMarkup({ name: "<img src=x>", unit: "<script>", max: 100, values }, 0)),
    );
    const change = tree.find((node) =>
      node.attrs?.some((attr) => attr.name === "class" && attr.value === "rw-trend__change"),
    );
    const content = nodes(change);
    assert.equal(
      content
        .filter((node) => node.nodeName === "#text")
        .map((node) => node.value)
        .join("")
        .trim(),
      text,
    );
    const icons = content.filter((node) => node.attrs?.some((attr) => attr.name === "data-icon"));
    assert.equal(icons.length, icon ? 1 : 0);
    if (icon)
      assert.ok(icons[0].attrs.some((attr) => attr.name === "data-icon" && attr.value === icon));
    assert.ok(
      !tree.some((node) => ["img", "script"].includes(node.tagName)),
      "user text remains escaped",
    );
  });
}
