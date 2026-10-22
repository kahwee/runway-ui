import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";
addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Runway UI",
    brandUrl: "../",
    brandTarget: "_self",
    colorPrimary: "#6a4cff",
    colorSecondary: "#6a4cff",
    appBg: "#f6f3ff",
    appContentBg: "#fffdf8",
    appBorderColor: "#ddd5f7",
    appBorderRadius: 14,
    textColor: "#2b2250",
    barSelectedColor: "#6a4cff",
    barBg: "#fffdf8",
    fontBase: 'ui-rounded, "SF Pro Rounded", "Nunito", system-ui, sans-serif',
  }),
  panelPosition: "bottom",
});
