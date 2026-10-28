import type { StoryObj } from "@storybook/html-vite";
import type { DeskExampleProps } from "./desk.tsx";
import { meta, range, select, text } from "../helpers.ts";
import { DeskExample } from "./desk.tsx";
import { renderReactStory } from "./story-host.ts";

export default { title: "React/Desk", tags: ["autodocs"] };
const args: DeskExampleProps = { title: "Field office", startingCash: 84250, theme: "cozy" };
export const Playable: StoryObj<DeskExampleProps> = {
  ...meta(
    "React/Desk",
    "Command bar, folio tabs, dossiers, meters, TanStack chart and a Next day console in a real React root.",
    args,
    {
      title: text("Workspace identity."),
      startingCash: range(0, 200000, 1000, "Starting credits."),
      theme: select(["cozy", "ledger", "whimsy"], "Runway theme."),
    },
  ),
  render: (props) => renderReactStory(DeskExample, props),
};
