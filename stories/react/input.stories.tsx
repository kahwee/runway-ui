import type { StoryObj } from "@storybook/html-vite";
import { expect, userEvent, within } from "storybook/test";
import { flag, meta, range } from "../helpers.ts";
import { InputExample, type InputExampleProps } from "./input-scope.tsx";
import { renderReactStory } from "./story-host.ts";
import "./forms.css";
import "./input.css";

export default { title: "React/Game input", tags: ["autodocs"] };
export const CommandStation: StoryObj<InputExampleProps> = {
  ...meta(
    "React/Game input",
    "Local, remappable shortcuts and opt-in controller navigation. Native editing, Tab and modal focus remain native.",
    { gamepad: false, loop: false, width: 640 },
    {
      gamepad: flag("Opt in to standard-mapped gamepads while this scope owns focus."),
      loop: flag("Wrap directional movement at boundaries."),
      width: range(220, 900, 20, "Maximum preview width."),
    },
  ),
  render: (args) => renderReactStory(InputExample, args),
};
export const KeyboardBoundaries: StoryObj<InputExampleProps> = {
  ...CommandStation,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup({ document: canvasElement.ownerDocument });
    const build = await canvas.findByRole("button", { name: "Build" });
    build.focus();
    await user.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("button", { name: "Research" })).toHaveFocus();
    await user.keyboard("{Home}{ArrowDown}");
    await expect(canvas.getByRole("button", { name: "Trade" })).toHaveFocus();
    await user.keyboard("n");
    await expect(canvas.getByRole("status")).toHaveTextContent("Cycle advanced");
    await user.click(canvas.getByRole("button", { name: "Remap next-cycle key" }));
    await user.keyboard("x");
    await expect(canvas.getByRole("status")).toHaveTextContent("Cycle advanced");
    await user.click(canvas.getByRole("textbox", { name: "Notes" }));
    await user.type(canvas.getByRole("textbox", { name: "Notes" }), "nx");
    await expect(canvas.getByRole("textbox", { name: "Notes" })).toHaveValue("nx");
    await user.click(canvas.getByRole("button", { name: "Nested command" }));
    await user.keyboard("n");
    await expect(canvas.getByRole("status")).toHaveTextContent("Nested action");
  },
};
export const Controller: StoryObj<InputExampleProps> = {
  ...CommandStation,
  args: { gamepad: true },
};
