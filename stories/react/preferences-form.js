import { createElement as h, useState } from "react";
import { Button, Checkbox, Field, Input, Select } from "../../react/index.js";
import { bounded } from "../helpers.js";

export function PreferencesForm({
  portal,
  heading,
  workspaceName,
  mode: initialMode,
  reminders,
  description,
  required,
  disabled,
  saveLabel,
  showUnavailable,
  width,
}) {
  const [name, setName] = useState(workspaceName);
  const [mode, setMode] = useState(initialMode);
  const [enabled, setEnabled] = useState(reminders);
  const [receipt, setReceipt] = useState("No changes saved.");
  return h(
    "form",
    {
      className: "react-form-example",
      style: { maxInlineSize: `${bounded(width, 220, 640, 420)}px` },
      onSubmit(event) {
        event.preventDefault();
        if (disabled) return;
        setReceipt(`Saved ${name}: ${mode}, reminders ${enabled ? "on" : "off"}.`);
      },
    },
    h("h2", null, heading),
    h(
      Field.Root,
      { className: "rw-field", name: "workspace", disabled },
      h(Field.Label, null, "Workspace name"),
      h(Input, { value: name, onValueChange: setName, required, disabled }),
      description ? h(Field.Description, null, description) : null,
    ),
    h(
      Field.Root,
      { className: "rw-field", name: "mode", disabled },
      h(Field.Label, null, "Work mode"),
      h(
        Select.Root,
        { disabled, value: mode, onValueChange: (value) => value && setMode(value) },
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
        { disabled, checked: enabled, onCheckedChange: setEnabled, className: "react-checkbox" },
        h(Checkbox.Indicator, null, "✓"),
      ),
      "Enable reminders",
    ),
    h(Button, { type: "submit", disabled }, saveLabel),
    showUnavailable ? h(Button, { disabled: true }, "Unavailable action") : null,
    h("p", { role: "status" }, receipt),
  );
}
