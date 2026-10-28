import type { Meta, StoryObj } from "@storybook/html-vite";
import type { PreferencesFormProps } from "./preferences-form.tsx";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { flag, meta, range, select, text } from "../helpers.ts";
import { PreferencesForm } from "./preferences-form.tsx";
import { renderReactStory } from "./story-host.ts";
import "./forms.css";

const args: PreferencesFormProps = {
  heading: "Workspace preferences",
  workspaceName: "Orchard",
  mode: "steady",
  reminders: false,
  description: "Used to identify this workspace.",
  required: true,
  disabled: false,
  saveLabel: "Save preferences",
  showUnavailable: true,
  width: 420,
};
const storyMeta: Meta<PreferencesFormProps> = {
  ...meta(
    "React/Base UI forms",
    "Real React 19 and Base UI controls. Args set the starting form state; preview edits stay local. Changing args remounts the form and clears its receipt. Toolbar themes also apply to the select portal.",
    args,
    {
      heading: text("Form heading."),
      workspaceName: text("Initial name; edits in the preview are local.", "Initial values"),
      mode: select(["care", "steady", "push"], "Initial work mode.", "Initial values"),
      reminders: flag("Initial checkbox state.", "Initial values"),
      description: text("Associated input help; empty hides it."),
      required: flag("Native required validation for the name."),
      disabled: flag("Disables every editable control and Save."),
      saveLabel: text("Submit action label."),
      showUnavailable: flag("Show a separate disabled-action example."),
      width: range(220, 640, 20, "Maximum form width; shrinks to the available canvas."),
    },
  ),
  title: "React/Base UI forms",
  tags: ["autodocs"],
  render: (values) => renderReactStory(PreferencesForm, values),
};

// Keep the original story URL while making its previously fixed values editable.
export default storyMeta;
type Story = StoryObj<PreferencesFormProps>;
export const Preferences: Story = {};
export const Disabled: Story = { args: { disabled: true, reminders: true, mode: "care" } };
export const Narrow: Story = {
  args: {
    width: 220,
    heading: "Preferences for the shared workspace",
    workspaceName: "A workspace with a long descriptive name",
    showUnavailable: false,
  },
};
export const KeyboardFlow: Story = {
  args: { showUnavailable: false },
  play: async ({ canvasElement, args: values }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup({ document: canvasElement.ownerDocument });
    const input = await canvas.findByRole("textbox", { name: /Workspace name/ });
    if (values.disabled) {
      await expect(input).toBeDisabled();
      await expect(canvas.getByRole("button", { name: values.saveLabel })).toBeDisabled();
      return;
    }
    await user.clear(input);
    await user.type(input, "North garden");
    await waitFor(() => expect(input).toHaveValue("North garden"));
    input.focus();
    await user.tab();
    await user.keyboard(" ");
    await user.keyboard("{End}{Enter}");
    await waitFor(() => expect(canvas.getByRole("combobox")).toHaveTextContent("push"));
    await user.tab();
    await user.keyboard(" ");
    await user.tab();
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(canvas.getByRole("status")).toHaveTextContent(
        `Saved North garden: push, reminders ${values.reminders ? "off" : "on"}.`,
      ),
    );
    await expect(canvas.getByRole("button", { name: values.saveLabel })).toHaveFocus();
  },
};
