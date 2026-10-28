import type { StoryObj } from "@storybook/html-vite";
import type { ButtonExampleProps, InputExampleProps } from "./controls.tsx";
import { expect, userEvent, within } from "storybook/test";
import { flag, meta, range, select, text } from "../helpers.ts";
import { ButtonExample, InputExample, ProgressExample } from "./controls.tsx";
import { renderReactStory } from "./story-host.ts";
import "./forms.css";

export default { title: "React/Controls", tags: ["autodocs"] };
const buttonArgs: ButtonExampleProps = {
  label: "Continue",
  variant: "primary",
  size: "md",
  disabled: false,
  width: 420,
};
export const Button: StoryObj<ButtonExampleProps> = {
  ...meta(
    "React/Controls",
    "Styled Base UI Button with native disabled state and a real activation counter.",
    buttonArgs,
    {
      label: text("Accessible button label."),
      variant: select(["primary", "secondary", "danger"], "Existing Runway button variant."),
      size: select(["sm", "md", "lg"], "Existing Runway button size."),
      disabled: flag("Prevents activation and removes the button from Tab order."),
      width: range(220, 640, 20, "Maximum preview width."),
    },
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        transform: (_source: string, { args }: { args: ButtonExampleProps }) =>
          `import { Button } from "runway-ui/react";\n\n<Button data-variant=${JSON.stringify(args.variant)} data-size=${JSON.stringify(args.size)} disabled={${args.disabled}} onClick={handleClick}>\n  {${JSON.stringify(args.label)}}\n</Button>`,
      },
    },
  },
  render: (args) => renderReactStory(ButtonExample, args),
};
const inputArgs: InputExampleProps = {
  label: "Workspace name",
  value: "Orchard",
  placeholder: "Enter a name",
  description: "Visible help is associated with the input.",
  disabled: false,
  readOnly: false,
  required: false,
  type: "text",
  width: 420,
};
export const Input: StoryObj<InputExampleProps> = {
  ...meta(
    "React/Controls",
    "Styled Base UI Input with Field label and help association.",
    inputArgs,
    {
      label: text("Accessible input label."),
      value: text("Initial value; preview typing is local.", "Initial values"),
      placeholder: text("Hint shown when the value is empty."),
      description: text("Associated help; empty hides it."),
      disabled: flag("Prevents editing and skips the control during Tab navigation."),
      readOnly: flag("Keeps the value selectable and focusable without editing."),
      required: flag("Exposes the native required state."),
      type: select(["text", "email", "search", "url"], "Native input type.", "State"),
      width: range(220, 640, 20, "Maximum preview width."),
    },
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        transform: (_source: string, { args }: { args: InputExampleProps }) =>
          `import { Field, Input } from "runway-ui/react";\n\n<Field.Root className="rw-field" disabled={${args.disabled}}>\n  <Field.Label>{${JSON.stringify(args.label)}}</Field.Label>\n  <Input defaultValue={${JSON.stringify(args.value)}} type=${JSON.stringify(args.type)} placeholder={${JSON.stringify(args.placeholder)}} readOnly={${args.readOnly}} required={${args.required}} />\n  <Field.Description>{${JSON.stringify(args.description)}}</Field.Description>\n</Field.Root>`,
      },
    },
  },
  render: (args) => renderReactStory(InputExample, args),
};
export const ButtonKeyboard: StoryObj<ButtonExampleProps> = {
  ...Button,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup({ document: canvasElement.ownerDocument });
    const button = await canvas.findByRole("button", { name: args.label });
    if (args.disabled) {
      await expect(button).toBeDisabled();
      await expect(canvas.getByRole("status")).toHaveTextContent("0 activations");
      return;
    }
    button.focus();
    await user.keyboard("{Enter}");
    await expect(canvas.getByRole("status")).toHaveTextContent("1 activation");
  },
};

export const Progress: StoryObj<import("./controls.tsx").ProgressExampleProps> = {
  ...meta(
    "React/Controls",
    "Native progress with an accessible name and application-owned units.",
    { label: "Experiment progress", value: 3, max: 10, indeterminate: false },
    {
      label: text("Accessible progress name."),
      value: range(0, 10, 1, "Completed work."),
      max: range(1, 10, 1, "Total work."),
      indeterminate: flag("Omit value while total work is unknown."),
    },
  ),
  render: (args) => renderReactStory(ProgressExample, args),
};
