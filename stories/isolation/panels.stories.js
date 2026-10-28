import panels from "../../styles/panels.css?inline";
import tokens from "../../styles/tokens.css?inline";
import { checkIsolatedPanels, isolatedFrame } from "../isolated-frame.js";

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
  render: () =>
    isolatedFrame({
      title: "Independent panels without controls or composition styles",
      styles: [tokens, panels],
      markup: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
<section class="rw-panel"><header class="rw-panel__header"><h2 class="rw-panel__title">Raised panel</h2><span>Overview</span></header><p>Surface, header and typography are owned by the panel primitive.</p><button type="button" class="rw-button">Native button, intentionally unstyled</button></section>
<section class="rw-panel" data-elevation="flat"><h2 class="rw-panel__title">Flat panel</h2><p>Same primitive. No composition dependencies.</p></section></div>`,
    }),
  play: checkIsolatedPanels,
};
