import "@fontsource-variable/fredoka";
import "@fontsource-variable/nunito";
import "../index.css";
import "../styles/native.css";
import "./preview.css";
export default {
  initialGlobals: { theme: "whimsy", density: "comfortable", depth: "raised", skin: "play" },
  globalTypes: {
    skin: {
      description: "Interface material",
      toolbar: { icon: "circlehollow", items: ["classic", "play"], dynamicTitle: true },
    },
    theme: {
      description: "Art direction",
      toolbar: {
        icon: "paintbrush",
        items: ["whimsy", "studio", "orbital", "parchment"],
        dynamicTitle: true,
      },
    },
    depth: {
      description: "Control depth",
      toolbar: { icon: "circlehollow", items: ["raised", "flat"], dynamicTitle: true },
    },
    density: {
      description: "Control spacing",
      toolbar: {
        icon: "component",
        items: ["comfortable", "compact"],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      codePanel: true,
      source: { type: "dynamic", language: "html", excludeDecorators: true },
    },
    controls: { expanded: true },
    options: {
      storySort: {
        order: [
          "Start here",
          "Charts",
          "Foundations",
          "Game patterns",
          "Behaviors",
          "Compositions",
        ],
      },
    },
  },
  decorators: [
    (story, context) => {
      const root = document.createElement("section");
      root.className = "rw-ui story-surface";
      root.dataset.theme = context.globals.theme;
      root.dataset.density = context.globals.density;
      root.dataset.depth = context.globals.depth;
      root.dataset.skin = context.globals.skin;
      const content = story();
      if (typeof content === "string") root.innerHTML = content;
      else root.append(content);
      // Native dialogs in this story need their own root tokens.
      root.querySelectorAll("dialog").forEach((dialog) => {
        dialog.dataset.theme = context.globals.theme;
        dialog.dataset.density = context.globals.density;
        dialog.dataset.depth = context.globals.depth;
        dialog.dataset.skin = context.globals.skin;
      });
      return root;
    },
  ],
};
