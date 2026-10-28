import { createElement as h, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button, Checkbox, Field, Input, Select } from "../../react/index.js";
import "./forms.css";

function Form({ portal }) {
  const [name, setName] = useState("Orchard");
  const [mode, setMode] = useState("steady");
  const [enabled, setEnabled] = useState(false);
  const [receipt, setReceipt] = useState("No changes saved.");
  return h(
    "form",
    {
      className: "react-form-example",
      onSubmit(event) {
        event.preventDefault();
        setReceipt(`Saved ${name}: ${mode}, reminders ${enabled ? "on" : "off"}.`);
      },
    },
    h("h2", null, "Workspace preferences"),
    h(
      Field.Root,
      { className: "rw-field", name: "workspace" },
      h(Field.Label, null, "Workspace name"),
      h(Input, { value: name, onValueChange: setName, required: true }),
      h(Field.Description, null, "Used to identify this workspace."),
    ),
    h(
      Field.Root,
      { className: "rw-field", name: "mode" },
      h(Field.Label, null, "Work mode"),
      h(
        Select.Root,
        { value: mode, onValueChange: (value) => value && setMode(value) },
        h(Select.Trigger, { className: "rw-button" }, h(Select.Value), h(Select.Icon, null, " ▾")),
        h(
          Select.Portal,
          { container: portal },
          h(
            Select.Positioner,
            { sideOffset: 8 },
            h(
              Select.Popup,
              { className: "rw-panel react-select-popup" },
              ...["care", "steady", "push"].map((value) =>
                h(
                  Select.Item,
                  { key: value, value, className: "react-select-option" },
                  h(Select.ItemIndicator, null, "✓ "),
                  h(Select.ItemText, null, value),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
    h(
      "label",
      { className: "react-checkbox-label" },
      h(
        Checkbox.Root,
        { checked: enabled, onCheckedChange: setEnabled, className: "react-checkbox" },
        h(Checkbox.Indicator, null, "✓"),
      ),
      "Enable reminders",
    ),
    h(Button, { type: "submit" }, "Save preferences"),
    h(Button, { disabled: true }, "Unavailable action"),
    h("p", { role: "status" }, receipt),
  );
}

// Storybook may detach/remount its canvas. Each connection owns exactly one root.
class ReactFormExample extends HTMLElement {
  connectedCallback() {
    if (this.root) return;
    this.classList.add("rw-ui");
    const surface = this.closest("[data-theme]");
    for (const key of ["theme", "density", "depth", "skin"])
      if (surface?.dataset[key]) this.dataset[key] = surface.dataset[key];
    const content = document.createElement("div");
    const portal = document.createElement("div");
    this.replaceChildren(content, portal);
    this.root = createRoot(content);
    this.root.render(h(Form, { portal }));
  }
  disconnectedCallback() {
    this.root?.unmount();
    this.root = null;
  }
}
if (!customElements.get("runway-react-form"))
  customElements.define("runway-react-form", ReactFormExample);

export default { title: "React/Base UI forms" };
export const Preferences = { render: () => document.createElement("runway-react-form") };
