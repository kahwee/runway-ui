import { useState } from "react";
import { Button, Checkbox, Field, Input, Select } from "../../react/index.js";
import { bounded } from "../helpers.js";

export interface PreferencesFormProps {
  portal?: HTMLElement;
  heading: string;
  workspaceName: string;
  mode: "care" | "steady" | "push";
  reminders: boolean;
  description: string;
  required: boolean;
  disabled: boolean;
  saveLabel: string;
  showUnavailable: boolean;
  width: number;
}
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
}: PreferencesFormProps) {
  const [name, setName] = useState(workspaceName);
  const [mode, setMode] = useState(initialMode);
  const [enabled, setEnabled] = useState(reminders);
  const [receipt, setReceipt] = useState("No changes saved.");
  return (
    <form
      className="react-form-example"
      style={{ maxInlineSize: `${bounded(width, 220, 640, 420)}px` }}
      onSubmit={(event) => {
        event.preventDefault();
        if (disabled) return;
        setReceipt(`Saved ${name}: ${mode}, reminders ${enabled ? "on" : "off"}.`);
      }}
    >
      <h2>{heading}</h2>
      <Field.Root className="rw-field" name="workspace" disabled={disabled}>
        <Field.Label>Workspace name</Field.Label>
        <Input value={name} onValueChange={setName} required={required} disabled={disabled} />
        {description ? <Field.Description>{description}</Field.Description> : null}
      </Field.Root>
      <Field.Root className="rw-field" name="mode" disabled={disabled}>
        <Field.Label>Work mode</Field.Label>
        <Select.Root
          disabled={disabled}
          value={mode}
          onValueChange={(value) => value && setMode(value)}
        >
          <Select.Trigger className="rw-button">
            <Select.Value />
            <Select.Icon> ▾</Select.Icon>
          </Select.Trigger>
          <Select.Portal container={portal}>
            <Select.Positioner sideOffset={8}>
              <Select.Popup className="rw-panel react-select-popup">
                {(["care", "steady", "push"] as const).map((value) => (
                  <Select.Item key={value} value={value} className="react-select-option">
                    <Select.ItemIndicator>✓ </Select.ItemIndicator>
                    <Select.ItemText>{value}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </Field.Root>
      <label className="react-checkbox-label">
        <Checkbox.Root
          disabled={disabled}
          checked={enabled}
          onCheckedChange={setEnabled}
          className="react-checkbox"
        >
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
        Enable reminders
      </label>
      <Button type="submit" disabled={disabled}>
        {saveLabel}
      </Button>
      {showUnavailable ? <Button disabled>Unavailable action</Button> : null}
      <p role="status">{receipt}</p>
    </form>
  );
}
