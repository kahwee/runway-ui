import { checkIsolatedPanels } from "../isolated-frame.ts";
import { renderRecipe } from "./entries.ts";

export default {
  title: "Isolation/Panels",
  parameters: {
    docs: {
      description: {
        component:
          "A panel needs only tokens.css and panels.css. Buttons and fields can be added independently; no workspace, studio, observatory or game-pattern stylesheet is needed.",
      },
    },
  },
};

export const StandalonePanels = {
  render: () => renderRecipe("panels"),
  play: checkIsolatedPanels,
};
