import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ButtonExample, InputExample } from "../stories/react/controls.tsx";
import { PreferencesForm } from "../stories/react/preferences-form.tsx";

const form = {
  heading: "Workspace preferences",
  workspaceName: "Orchard",
  mode: "steady",
  reminders: false,
  description: "Visible help",
  required: true,
  disabled: false,
  saveLabel: "Save preferences",
  showUnavailable: true,
  width: 420,
};
const render = (component, props) => renderToStaticMarkup(createElement(component, props));

test("form args control content, initial state and the optional disabled example", () => {
  const html = render(PreferencesForm, {
    ...form,
    heading: "Long & clear",
    workspaceName: "North",
    mode: "care",
    reminders: true,
    required: false,
    showUnavailable: false,
    saveLabel: "Apply",
    description: "",
  });
  assert.match(html, /Long &amp; clear/);
  assert.match(html, /value="North"/);
  assert.match(html, /aria-checked="true"/);
  assert.match(html, /value="care"/);
  assert.match(html, />Apply<\/button>/);
  assert.doesNotMatch(html, /Unavailable action|required=""|Visible help/);
});

test("disabled form args disable controls and preserve current values", () => {
  const html = render(PreferencesForm, { ...form, disabled: true });
  assert.match(html, /value="Orchard"/);
  const buttons = [...html.matchAll(/<button\b[^>]*>/g)].map(([tag]) => tag);
  assert.ok(buttons.length >= 2);
  assert.ok(buttons.every((tag) => /disabled=""/.test(tag)));
  assert.match(html, /<input[^>]*disabled=""/);
  assert.match(html, /aria-disabled="true"/);
});

test("example widths are bounded and untrusted content remains React text", () => {
  const html = render(PreferencesForm, { ...form, width: -1, heading: "<script>bad()</script>" });
  assert.match(html, /max-inline-size:220px/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(render(PreferencesForm, { ...form, width: 10000 }), /max-inline-size:640px/);
});

test("individual control playgrounds preserve native state and meaningful args", () => {
  const button = render(ButtonExample, {
    label: "Delete",
    variant: "danger",
    size: "lg",
    disabled: true,
    width: 300,
  });
  assert.match(button, /data-variant="danger"/);
  assert.match(button, /data-size="lg"/);
  assert.match(button, /disabled=""/);
  assert.match(button, /0 activations/);
  const input = render(InputExample, {
    label: "Address",
    value: "example@example.test",
    type: "email",
    readOnly: true,
    required: true,
    description: "Keep this address",
    width: 300,
  });
  assert.match(input, /type="email"/);
  assert.match(input, /readOnly=""/i);
  assert.match(input, /required=""/);
  assert.match(input, /Keep this address/);
});
