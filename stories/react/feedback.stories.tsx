import type { StoryObj } from "@storybook/html-vite";
import type { FeedbackExampleProps } from "./feedback.tsx";
import { expect, userEvent, within } from "storybook/test";
import { meta, range, select } from "../helpers.ts";
import { FeedbackExample } from "./feedback.tsx";
import { renderReactStory } from "./story-host.ts";

export default { title: "React/Feedback", tags: ["autodocs"] };
const args: FeedbackExampleProps = { theme: "cozy", startingValue: 12000 };
export const Playground: StoryObj<FeedbackExampleProps> = {
  ...meta(
    "React/Feedback",
    "AnimatedNumber, Meter change flash, Confetti and Toaster. All motion is skipped under prefers-reduced-motion.",
    args,
    {
      theme: select(["cozy", "ledger", "whimsy"], "Runway theme."),
      startingValue: range(0, 100000, 500, "Starting credits."),
    },
  ),
  render: (props) => renderReactStory(FeedbackExample, props),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Celebrate" }));
    await expect(await canvas.findByText("You reached a milestone!")).toBeVisible();
  },
};
