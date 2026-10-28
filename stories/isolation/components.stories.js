import { checkIsolatedRecipe } from "../isolated-frame.js";
import { renderRecipe } from "./entries.js";

export default {
  title: "Isolation/Components",
  parameters: {
    docs: {
      description: {
        component:
          "Each frame loads only the imports listed in the component dependency guide. Toolbar themes cannot leak in. Play checks exercise computed styles, native input changes and link navigation.",
      },
    },
  },
};
export const Fields = {
  render: () => renderRecipe("fields"),
  play: (context) => checkIsolatedRecipe(context, "fields"),
};
export const Forms = {
  render: () => renderRecipe("forms"),
  play: (context) => checkIsolatedRecipe(context, "forms"),
};
export const ViewNavigation = {
  render: () => renderRecipe("viewNavigation"),
  play: (context) => checkIsolatedRecipe(context, "viewNavigation"),
};
export const SectionNavigation = {
  render: () => renderRecipe("sectionNavigation"),
  play: (context) => checkIsolatedRecipe(context, "sectionNavigation"),
};
export const Charts = {
  render: () => renderRecipe("charts"),
  play: (context) => checkIsolatedRecipe(context, "charts"),
};
