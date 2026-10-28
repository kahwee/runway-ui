import type { StoryObj } from "@storybook/html-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { flag, meta, range, text } from "../helpers.ts";
import {
  InventoryExample,
  RangeExample,
  type InventoryExampleProps,
  type RangeExampleProps,
} from "./interaction-examples.tsx";
import { renderReactStory } from "./story-host.ts";
import "./forms.css";

export default { title: "React/Interactions", tags: ["autodocs"] };

export const Allocation: StoryObj<RangeExampleProps> = {
  ...meta(
    "React/Interactions",
    "A controlled native slider with an associated label and output. Parent updates stay in sync with the filled track.",
    { label: "Resource allocation", value: 25, disabled: false, width: 420 },
    {
      label: text("Slider label."),
      value: range(0, 100, 5, "Initial allocation."),
      disabled: flag("Disable the slider and preset."),
      width: range(220, 640, 20, "Maximum preview width."),
    },
  ),
  render: (args) => renderReactStory(RangeExample, args),
};
export const AllocationUpdates: StoryObj<RangeExampleProps> = {
  ...Allocation,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const slider = await canvas.findByRole("slider", { name: args.label });
    if (args.disabled) {
      await expect(slider).toBeDisabled();
      return;
    }
    const user = userEvent.setup({ document: canvasElement.ownerDocument });
    await user.click(canvas.getByRole("button", { name: "Use balanced allocation" }));
    await waitFor(() => expect(slider).toHaveValue("75"));
    await expect(canvas.getByRole("status")).toHaveTextContent("75%");
    await expect(slider).toHaveStyle({ "--rw-fill": "75%" });
    await expect(slider).toHaveAccessibleName(args.label);
  },
};
export const SupplyCabinet: StoryObj<InventoryExampleProps> = {
  ...meta(
    "React/Interactions",
    "Roving focus skips disabled slots and retains an available Tab entry after items are reordered or removed.",
    { disabled: false, empty: false, width: 420 },
    {
      disabled: flag("Disable every slot."),
      empty: flag("Show an empty cabinet."),
      width: range(220, 640, 20, "Maximum preview width."),
    },
  ),
  render: (args) => renderReactStory(InventoryExample, args),
};
export const CabinetKeyboard: StoryObj<InventoryExampleProps> = {
  ...SupplyCabinet,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const group = await canvas.findByRole("group", { name: "Supplies" });
    if (args.empty || args.disabled) {
      await expect(group.querySelector('[tabindex="0"]')).toBeNull();
      return;
    }
    const slots = within(group);
    const user = userEvent.setup({ document: canvasElement.ownerDocument });
    const seeds = slots.getByRole("button", { name: "Seeds" });
    await expect(seeds).toHaveAttribute("tabindex", "0");
    seeds.focus();
    await user.keyboard("{ArrowRight}");
    await expect(slots.getByRole("button", { name: "Water" })).toHaveFocus();
    await user.keyboard("{End}{Enter}");
    await expect(slots.getByRole("button", { name: "Tools" })).toHaveFocus();
    await expect(canvas.getByRole("status")).toHaveTextContent("Tools selected");
    await user.keyboard("{Home}{ArrowDown}");
    await expect(slots.getByRole("button", { name: "Tools" })).toHaveFocus();
    await user.keyboard("{Home}");
    await user.click(canvas.getByRole("button", { name: "Reverse slots" }));
    await expect(seeds).toHaveAttribute("tabindex", "0");
    await user.click(canvas.getByRole("button", { name: "Remove seeds" }));
    await waitFor(() => expect(slots.queryByRole("button", { name: "Seeds" })).toBeNull());
    await expect(slots.getByRole("button", { name: "Tools" })).toHaveAttribute("tabindex", "0");
  },
};
export const EmptyCabinet: StoryObj<InventoryExampleProps> = {
  ...SupplyCabinet,
  args: { empty: true },
};
export const UnavailableCabinet: StoryObj<InventoryExampleProps> = {
  ...SupplyCabinet,
  args: { disabled: true },
};
