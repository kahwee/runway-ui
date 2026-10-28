import controls from "../../styles/controls.css?inline";
import accessibility from "../../styles/patterns/accessibility.css?inline";
import dock from "../../styles/patterns/dock.css?inline";
import tokens from "../../styles/tokens.css?inline";
import { checkIsolatedControls, isolatedFrame } from "../isolated-frame.js";

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

const buttons = `<button type="button" class="rw-button" aria-pressed="true">Build <kbd class="rw-shortcut">B</kbd></button>
<button type="button" class="rw-button" aria-pressed="false">Inspect <kbd class="rw-shortcut">I</kbd></button>
<button type="button" class="rw-button" disabled>Unavailable</button>`;

export const StandaloneControls = {
  render: () =>
    isolatedFrame({
      title: "Controls with tokens and controls CSS only",
      styles: [tokens, controls],
      markup: `<h1>Standalone controls</h1><p>Pressed state, shortcuts and disabled controls without game-pattern styles.</p><div style="display:flex;gap:16px;align-items:center">${buttons}</div>`,
    }),
  play: checkIsolatedControls,
};

export const DockComposition = {
  render: () =>
    isolatedFrame({
      title: "Dock with explicit control dependencies",
      styles: [tokens, controls, dock, accessibility],
      markup: `<h1>Action dock</h1><p>The dock adds layout and animation; controls own button states and shortcuts.</p><div class="rw-dock" role="group" aria-label="Workspace actions">${buttons}</div>`,
    }),
  play: checkIsolatedControls,
};
