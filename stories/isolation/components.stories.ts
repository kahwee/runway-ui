import { checkIsolatedRecipe } from "../isolated-frame.ts";
import { renderRecipe } from "./entries.ts";

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

export const Dialogs = {
  render: () => renderRecipe("dialogs"),
  play: (context) => checkIsolatedRecipe(context, "dialogs"),
};

export const Disclosures = {
  render: () => renderRecipe("disclosures"),
  play: (context) => checkIsolatedRecipe(context, "disclosures"),
};

export const Resources = {
  render: () => renderRecipe("resources"),
  play: (context) => checkIsolatedRecipe(context, "resources"),
};

export const Inventory = {
  render: () => renderRecipe("inventory"),
  play: (context) => checkIsolatedRecipe(context, "inventory"),
};
