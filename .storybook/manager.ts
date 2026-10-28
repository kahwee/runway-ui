import "@fontsource-variable/nunito";
import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Runway UI",
    brandUrl: "../",
    brandTarget: "_self",
    colorPrimary: "#355c4b",
    colorSecondary: "#355c4b",
    appBg: "#edf0e4",
    appContentBg: "#fffbee",
    appBorderColor: "#cdd2b9",
    appBorderRadius: 14,
    textColor: "#2d4640",
    barSelectedColor: "#355c4b",
    barBg: "#fffbee",
    fontBase: 'ui-rounded, "SF Pro Rounded", "Nunito", system-ui, sans-serif',
  }),
  panelPosition: "bottom",
  // The welcome page has no args: give its introduction the full canvas.
  // Controls remain available when visitors enter an actual playground.
  layoutCustomisations: {
    showPanel: (state, fallback) =>
      state.storyId === "start-here-runway-ui--welcome" ? false : fallback,
  },
});
