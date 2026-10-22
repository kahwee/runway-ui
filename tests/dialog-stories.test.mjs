import assert from "node:assert/strict";
import test from "node:test";
import { parseFragment } from "parse5";
import meta, {
  CompactActions,
  LongContent,
  Playground,
  RequiredDecision,
} from "../stories/foundations/dialog.stories.js";

function elements(story, overrides = {}) {
  const nodes = [];
  const visit = (node) => {
    if (node.tagName) {
      node.attributes = Object.fromEntries(node.attrs.map(({ name, value }) => [name, value]));
      nodes.push(node);
    }
    for (const child of node.childNodes ?? []) visit(child);
  };
  visit(parseFragment(story.render({ ...meta.args, ...story.args, ...overrides })));
  return nodes;
}

test("dialog stories retain resolvable names and enabled focus targets", () => {
  for (const story of [Playground, CompactActions, LongContent, RequiredDecision]) {
    const nodes = elements(story);
    const dialog = nodes.find((node) => node.tagName === "dialog");
    assert.ok(nodes.some((node) => node.attributes.id === dialog.attributes["aria-labelledby"]));
    const focused = nodes.filter((node) => "autofocus" in node.attributes);
    assert.equal(focused.length, 1);
    assert.equal(focused[0].attributes.value, "cancel");
    assert.equal("disabled" in focused[0].attributes, false);
    if (dialog.attributes["aria-describedby"])
      assert.ok(nodes.some((node) => node.attributes.id === dialog.attributes["aria-describedby"]));
  }
});

test("required decisions offer explicit outcomes without a generic close button", () => {
  const nodes = elements(RequiredDecision);
  assert.equal(nodes.find((node) => node.tagName === "dialog").attributes.closedby, "none");
  assert.equal(
    nodes.some((node) => node.attributes.command === "close"),
    false,
  );
  assert.deepEqual(
    nodes.filter((node) => "value" in node.attributes).map((node) => node.attributes.value),
    ["cancel", "confirm"],
  );
});

test("long content is not announced as one giant accessible description", () => {
  const dialog = elements(LongContent).find((node) => node.tagName === "dialog");
  assert.equal("aria-describedby" in dialog.attributes, false);
});

test("invalid authoring combinations show guidance instead of an unnamed or trapped modal", () => {
  for (const overrides of [
    { title: "   " },
    { showCancel: false, showClose: false, confirmDisabled: true, dismissal: "none" },
  ]) {
    const nodes = elements(Playground, overrides);
    assert.equal(
      nodes.some((node) => node.tagName === "dialog"),
      false,
    );
    assert.ok(nodes.some((node) => node.attributes.role === "alert"));
  }
});
