import charts from "../../styles/charts.css?inline";
import controls from "../../styles/controls.css?inline";
import fields from "../../styles/fields.css?inline";
import forms from "../../styles/forms.css?inline";
import icons from "../../styles/icons.css?inline";
import panels from "../../styles/panels.css?inline";
import accessibility from "../../styles/patterns/accessibility.css?inline";
import dock from "../../styles/patterns/dock.css?inline";
import sectionTabs from "../../styles/patterns/section-tabs.css?inline";
import viewTabs from "../../styles/patterns/view-tabs.css?inline";
import tokens from "../../styles/tokens.css?inline";
import { isolatedFrame } from "../isolated-frame.js";
import { recipes } from "./recipes.js";

const entries = {
  "styles/tokens.css": tokens,
  "styles/controls.css": controls,
  "styles/panels.css": panels,
  "styles/fields.css": fields,
  "styles/forms.css": forms,
  "styles/icons.css": icons,
  "styles/charts.css": charts,
  "styles/patterns/dock.css": dock,
  "styles/patterns/accessibility.css": accessibility,
  "styles/patterns/section-tabs.css": sectionTabs,
  "styles/patterns/view-tabs.css": viewTabs,
};

export function renderRecipe(key) {
  const recipe = recipes[key];
  return isolatedFrame({
    title: recipe.title,
    styles: recipe.styles.map((path) => {
      if (!(path in entries)) throw new Error(`Missing isolated CSS entry: ${path}`);
      return entries[path];
    }),
    markup: recipe.markup,
  });
}
