import "@fontsource-variable/fredoka";
import "@fontsource-variable/nunito";
import "../index.css";
import "../styles/native.css";
import "./preview.css";
export default {
  initialGlobals: { theme: "cozy", density: "comfortable", depth: "raised", skin: "classic" },
  globalTypes: {
    skin: {
      description: "Interface material",
      toolbar: { icon: "circlehollow", items: ["classic", "play"], dynamicTitle: true },
    },
    theme: {
      description: "Art direction",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "cozy", title: "Cozy / Sweet sim" },
          { value: "cozy-night", title: "Cozy night / Lamplight" },
          { value: "studio", title: "Studio / Light" },
          { value: "orbital", title: "Orbital / Dark" },
          { value: "midnight", title: "Midnight / Black" },
          "whimsy",
          "parchment",
          "ledger",
        ],
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
          "React",
          "Foundations",
          "Charts",
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
      // Nested UI scopes reset tokens; inherit toolbar choices unless explicitly themed.
      root.querySelectorAll<HTMLElement>(".rw-ui, dialog").forEach((dialog) => {
        dialog.dataset.theme ??= context.globals.theme;
        dialog.dataset.density ??= context.globals.density;
        dialog.dataset.depth ??= context.globals.depth;
        dialog.dataset.skin ??= context.globals.skin;
      });
      return root;
    },
  ],
};
