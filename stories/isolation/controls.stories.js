import { checkIsolatedControls } from "../isolated-frame.js";
import { renderRecipe } from "./entries.js";

export default {
  title: "Isolation/Controls",
  parameters: {
    docs: {
      description: {
        component:
          "These examples render in separate documents. Global library styles and toolbar themes cannot leak in. Controls import only tokens.css and controls.css; the dock adds its own recipe and shared motion preferences. Play checks verify actual computed styles.",
      },
    },
  },
};

export const StandaloneControls = {
  render: () => renderRecipe("controls"),
  play: checkIsolatedControls,
};
export const DockComposition = {
  render: () => renderRecipe("dock"),
  play: checkIsolatedControls,
};
