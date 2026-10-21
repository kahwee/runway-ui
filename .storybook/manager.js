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
  }),
  panelPosition: "bottom",
});
