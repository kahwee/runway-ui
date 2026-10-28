import workshop from "../../index.html?raw";
import { escapeHTML as e, flag, meta, select, text } from "../helpers.js";
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
      showProduction: flag("Include the shared-track production ledger.", "Content"),
      showEconomy: flag("Include the HTML-table economy chart.", "Content"),
      showDescriptions: flag("Display panel explanations.", "Content"),
    },
  ),
};

export const OperationsRoom = {
  render: (a) => {
    const source = new DOMParser().parseFromString(workshop, "text/html");
    const root = document.createElement("div");
    root.className = "rw-stack";
    root.innerHTML = `<p class="rw-kicker">Management / operations room</p><h1>${e(a.title)}</h1>`;
    const grid = document.createElement("div");
    grid.className = "story-grid";
    grid.dataset.columns = a.columns;
    const panels = [...source.querySelectorAll("#simulation .rw-panel")];
    panels.forEach((panel, index) => {
      if ((index === 0 && !a.showProduction) || (index === 1 && !a.showEconomy)) return;
      const copy = panel.cloneNode(true);
      const heading = copy.querySelector("h3");
      if (heading) {
        const title = document.createElement("h2");
        title.textContent = heading.textContent;
        heading.replaceWith(title);
      }
      const ledger = copy.querySelector(".rw-ledger");
      if (ledger) {
        const scroll = document.createElement("div");
        scroll.className = "story-scroll";
        scroll.tabIndex = 0;
        scroll.setAttribute("role", "region");
        scroll.setAttribute("aria-label", "Production ledger");
        ledger.replaceWith(scroll);
        scroll.append(ledger);
      }
      if (!a.showDescriptions) copy.querySelector("p")?.remove();
      grid.append(copy);
    });
    root.append(grid);
    return root;
  },
};
