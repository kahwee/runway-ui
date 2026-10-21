import workshop from "../index.html?raw";
import { escapeHTML as e, text, flag, select, meta } from "./helpers.js";
export default {
  title: "Compositions/Game interface",
  tags: ["autodocs"],
  ...meta(
    "Compositions/Game interface",
    "A focused production/economy composition assembled from the public workshop. Use the theme and density toolbar across every component.",
    {
      title: "A system you can read at a glance.",
      columns: "two",
      showProduction: true,
      showEconomy: true,
      showDescriptions: true,
    },
    {
      title: text("Page heading."),
      columns: select(["one", "two"], "Composition column count."),
      showProduction: flag(
        "Include the shared-track production ledger.",
        "Content",
      ),
      showEconomy: flag("Include the HTML-table economy chart.", "Content"),
      showDescriptions: flag("Display panel explanations.", "Content"),
    },
  ),
};

export const OperationsRoom = {
  render: (a) => {
    const source = new DOMParser().parseFromString(workshop, "text/html");
    const root = document.createElement("div");
    root.className = "g-stack";
    root.innerHTML = `<p class="g-kicker">Management / operations room</p><h1>${e(a.title)}</h1>`;
    const grid = document.createElement("div");
    grid.className = "story-grid";
    grid.style.gridTemplateColumns =
      a.columns === "one" ? "1fr" : "repeat(2,minmax(0,1fr))";
    const panels = [...source.querySelectorAll("#simulation .g-panel")];
    panels.forEach((panel, index) => {
      if ((index === 0 && !a.showProduction) || (index === 1 && !a.showEconomy))
        return;
      const copy = panel.cloneNode(true);
      if (!a.showDescriptions) copy.querySelector("p")?.remove();
      grid.append(copy);
    });
    root.append(grid);
    return root;
  },
};
