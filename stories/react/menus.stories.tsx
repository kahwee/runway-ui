import type { StoryObj } from "@storybook/html-vite";
import type { MenusExampleProps } from "./menus.tsx";
import { flag, meta, range } from "../helpers.ts";
import { MenusExample } from "./menus.tsx";
import { renderReactStory } from "./story-host.ts";
import "./forms.css";

export default { title: "React/Menus", tags: ["autodocs"] };
const args: MenusExampleProps = { width: 380, disabled: false };
export const SelectComboboxPopover: StoryObj<MenusExampleProps> = {
  ...meta(
    "React/Menus",
    "Base UI Select, Combobox and Popover with one shared trigger, list and item look.",
    args,
    {
      width: range(240, 640, 20, "Maximum preview width."),
      disabled: flag("Disables the select and combobox."),
    },
  ),
  render: (a) => renderReactStory(MenusExample, a),
};
