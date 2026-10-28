import type { StoryObj } from "@storybook/html-vite";
import type { ComponentsExampleProps } from "./components.tsx";
import { expect, within } from "storybook/test";
import { meta, range, select, text } from "../helpers.ts";
import { ComponentsExample } from "./components.tsx";
import { renderReactStory } from "./story-host.ts";

export default { title: "React/Components", tags: ["autodocs"] };
const args: ComponentsExampleProps = {
  title: "Morning briefing",
  energy: 72,
  tone: "morale",
  badge: "New day",
  theme: "cozy",
};
export const GameCard: StoryObj<ComponentsExampleProps> = {
  ...meta(
    "React/Components",
    "Panel, Badge, Resource and Meter. The meter exposes role=meter with its value to assistive technology.",
    args,
    {
      title: text("Panel heading."),
      energy: range(0, 100, 1, "Meter value from 0 to 100.", "State"),
      tone: select(["morale", "energy", "warning", "danger", "design", "pm"], "Meter color tone."),
      badge: text("Badge label."),
      theme: select(["cozy", "ledger", "whimsy"], "Runway theme."),
    },
  ),
  render: (props) => renderReactStory(ComponentsExample, props),
  play: async ({ canvasElement }) => {
    const meter = await within(canvasElement).findByRole("meter", { name: "Team energy" });
    await expect(meter).toHaveAttribute("aria-valuenow", "72");
  },
};
