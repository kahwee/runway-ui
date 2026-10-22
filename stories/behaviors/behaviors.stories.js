import { createInventory } from "../../behaviors/inventory.js";
import { bindNavigation } from "../../behaviors/navigation.js";
import { bounded, escapeHTML as e, flag, object, range, text, withDefaults } from "../helpers.js";

// Documentation-only host; the library requires no custom elements.
if (!customElements.get("runway-story-host"))
  customElements.define(
    "runway-story-host",
    class extends HTMLElement {
      connectedCallback() {
        this.cleanup?.();
        this.cleanup = this.setup?.();
      }
      disconnectedCallback() {
        this.cleanup?.();
        this.cleanup = undefined;
      }
    },
  );
export default {
  title: "Behaviors/Optional JavaScript",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "These two playgrounds explicitly opt into JavaScript. DOM connection installs one helper; disconnection disposes it. Changing controls remounts with the new configuration.",
      },
    },
  },
};
export const KeyboardNavigation = {
  args: {
    label: "World views",
    items: ["Overview", "Locked", "Resources", "Research"],
    disabledIndex: 1,
    columns: 1,
    wrap: true,
  },
  argTypes: {
    label: text("Accessible toolbar name."),
    items: object("Array of action labels."),
    disabledIndex: range(-1, 12, 1, "Disabled action index; -1 disables none.", "State"),
    columns: range(1, 4, 1, "Logical movement columns; up/down move this many eligible actions."),
    wrap: flag("Wrap movement at the ends of the eligible-action list.", "Navigation"),
  },
  render: (a) => {
    const root = document.createElement("runway-story-host");
    if (!Array.isArray(a.items) || !a.items.length) {
      root.innerHTML = '<p role="alert">Provide at least one action label.</p>';
      return root;
    }
    root.innerHTML = `<h2>Roving keyboard focus</h2><p>Tab enters the group. Arrows, Home and End move focus; disabled controls are skipped.</p><div class="rw-dock" role="toolbar" aria-label="${e(a.label)}">${a.items.map((label, i) => `<button class="rw-button"${i === a.disabledIndex ? " disabled" : ""}>${e(label)}</button>`).join("")}</div><p role="status">Choose a view.</p>`;
    root.setup = () => {
      const nav = bindNavigation(root.querySelector("[role=toolbar]"), {
        columns: Math.round(bounded(a.columns, 1, 4)),
        wrap: a.wrap,
      });
      const select = (event) => {
        const button = event.target.closest("button");
        if (button)
          root.querySelector("[role=status]").textContent = `${button.textContent} selected.`;
      };
      root.addEventListener("click", select);
      return () => {
        nav.destroy();
        root.removeEventListener("click", select);
      };
    };
    return root;
  },
};
export const VirtualInventory = {
  args: {
    title: "Virtual equipment catalog",
    count: 10000,
    prefix: "Equipment",
    columns: 6,
    rowHeight: 92,
    overscan: 1,
  },
  argTypes: {
    title: text("Visible heading."),
    prefix: text("Label prefix for synthetic records."),
    count: range(1, 10000, 1, "Number of synthetic items.", "Data"),
    columns: range(1, 12, 1, "Fixed number of columns."),
    rowHeight: range(48, 128, 4, "Fixed row height; helper synchronizes CSS sizing."),
    overscan: range(0, 4, 1, "Extra mounted rows above and below the viewport."),
  },
  render: (a) => {
    const root = document.createElement("runway-story-host");
    root.className = "story-width";
    root.style.display = "block";
    root.innerHTML = `<h2>${e(a.title)}</h2><p>End reaches the final item; Enter selects it. Changing arguments remounts this optional behavior.</p><div class="rw-virtual" tabindex="0" aria-label="${e(a.title)}"></div><p role="status">No item selected.</p>`;
    root.setup = () => {
      const inventory = createInventory(root.querySelector(".rw-virtual"), {
        items: Array.from({ length: Math.round(bounded(a.count, 1, 10000)) }, (_, i) => ({
          label: `${a.prefix} ${i + 1}`,
          icon: "coins",
        })),
        columns: Math.round(bounded(a.columns, 1, 12)),
        rowHeight: bounded(a.rowHeight, 48, 128),
        overscan: Math.round(bounded(a.overscan, 0, 4)),
        onSelect: (item) => {
          root.querySelector("[role=status]").textContent = `${item.label} selected.`;
        },
      });
      return () => inventory.destroy();
    };
    return root;
  },
};
for (const story of [KeyboardNavigation, VirtualInventory])
  story.argTypes = withDefaults(story.args, story.argTypes);
