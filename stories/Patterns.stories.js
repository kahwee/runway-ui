import {
  bounded,
  escapeHTML as e,
  flag,
  iconHTML,
  object,
  range,
  text,
  withDefaults,
} from "./helpers.js";
export default {
  title: "Game patterns/Systems",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Application-owned data and state, rendered with reusable HTML classes. Change content and states using Controls; no simulation logic is hidden in these examples.",
      },
    },
  },
};
export const ResourceHUD = {
  args: {
    label: "Credits",
    amount: 12840,
    capacity: 20000,
    rate: 240,
    icon: "coins",
    showCapacity: false,
    showRate: true,
  },
  argTypes: {
    label: text("Resource name."),
    amount: {
      control: "number",
      description: "Current quantity.",
      table: { category: "Data" },
    },
    capacity: {
      ...range(1, 50000, 100, "Maximum capacity.", "Data"),
      if: { arg: "showCapacity" },
    },
    rate: {
      control: "number",
      description: "Signed change per cycle.",
      if: { arg: "showRate" },
      table: { category: "Data" },
    },
    icon: text(
      "Phosphor icon name (coins, users, flask, sun…) or any text symbol; hidden from accessibility APIs.",
    ),
    showCapacity: flag("Append capacity to the displayed quantity.", "Content"),
    showRate: flag("Show signed rate and cycle unit.", "Content"),
  },
  render: (a) =>
    `<div class="rw-panel story-width"><div class="rw-resource"><span class="rw-resource__icon" aria-hidden="true">${iconHTML(a.icon)}</span><div><strong>${e(a.amount)}${a.showCapacity ? ` / ${e(a.capacity)}` : ""}</strong><small>${e(a.label)}${a.showRate ? ` · ${Number(a.rate) > 0 ? "+" : ""}${e(a.rate)} / cycle` : ""}</small></div></div></div>`,
};
export const EquipmentSlots = {
  args: {
    title: "Equipment",
    items: ["Portable terminal", "Survey kit", "Power cell", "Compass"],
    columns: 4,
    selected: 1,
    disabled: 2,
    rare: 0,
    icon: "coins",
  },
  argTypes: {
    title: text("Visible collection heading."),
    items: object("Array of item labels, from 1 to 24."),
    columns: range(1, 8, 1, "--rw-columns on the slot grid."),
    selected: range(-1, 23, 1, "Selected item index; -1 means none.", "State"),
    disabled: range(-1, 23, 1, "Disabled item index; -1 means none.", "State"),
    rare: range(-1, 23, 1, "Rare item index; -1 means none.", "State"),
    icon: text("Shared Phosphor icon name or text symbol."),
  },
  render: (a) => {
    if (!Array.isArray(a.items) || !a.items.length || a.items.length > 24)
      return '<p role="alert">Provide 1–24 item labels.</p>';
    return `<section class="story-width"><h2>${e(a.title)}</h2><div class="rw-slots" style="--rw-columns:${Math.round(bounded(a.columns, 1, 8))}">${a.items.map((item, i) => `<button class="rw-slot" type="button" aria-pressed="${i === a.selected}" aria-label="${e(item)}${i === a.rare ? ", rare" : ""}"${i === a.disabled ? " disabled" : ""}${i === a.rare ? ' data-rarity="rare"' : ""}><span class="rw-slot__icon" aria-hidden="true">${iconHTML(a.icon)}</span><small>${e(item)}</small></button>`).join("")}</div></section>`;
  },
};
export const Objectives = {
  args: {
    items: ["Establish a base", "Produce 200 oxygen", "Survey the highlands"],
    completed: 1,
  },
  argTypes: {
    items: object("Array of objective labels."),
    completed: range(0, 12, 1, "Number of completed objectives from the start.", "State"),
  },
  render: (a) =>
    Array.isArray(a.items)
      ? `<ul class="rw-objectives">${a.items.map((label, i) => `<li data-complete="${i < a.completed}"><span>${i < a.completed ? `${iconHTML("check-circle", "fill")} Complete` : `${iconHTML("circle", "bold")} Pending`}</span><span>${e(label)}</span></li>`).join("")}</ul>`
      : '<p role="alert">Provide an array of objective labels.</p>',
};
export const Choice = {
  args: {
    title: "Upgrade oxygen production",
    description: "+6 units per cycle",
    cost: "200 credits",
    disabled: false,
    selected: false,
  },
  argTypes: {
    title: text("Action title."),
    description: text("Consequence shown before activation."),
    cost: text("Visible cost or requirement."),
    disabled: flag("Native disabled state."),
    selected: flag("aria-pressed marks a selected choice; the parent uses :has() for its border."),
  },
  render: (a) =>
    `<section class="rw-panel story-width"><button type="button" class="rw-choice" aria-pressed="${a.selected}"${a.disabled ? " disabled" : ""}><span><strong>${e(a.title)}</strong><small>${e(a.description)}</small></span><span>${e(a.cost)}</span></button></section>`,
};
export const ActionDock = {
  args: {
    label: "World views",
    items: ["Overview", "Resources", "Research"],
    selected: 0,
    showShortcuts: true,
  },
  argTypes: {
    label: text("Accessible navigation name."),
    items: object("Array of 1–8 view labels."),
    selected: range(-1, 7, 1, "Selected action index.", "State"),
    showShortcuts: flag(
      "Show shortcut hints; applications must bind their actual keys.",
      "Content",
    ),
  },
  render: (a) =>
    Array.isArray(a.items) && a.items.length > 0 && a.items.length <= 8
      ? `<nav class="rw-dock" aria-label="${e(a.label)}">${a.items.map((label, i) => `<button class="rw-button" type="button" aria-pressed="${i === a.selected}">${e(label)}${a.showShortcuts ? ` <kbd class="rw-shortcut">${i + 1}</kbd>` : ""}</button>`).join("")}</nav>`
      : '<p role="alert">Provide at most eight view labels.</p>',
};
export const ProductionLedger = {
  args: {
    label: "Production per cycle",
    headers: ["Resource", "Stored", "Produced", "Consumed"],
    rows: [
      ["Oxygen", 120, 24, 18],
      ["Water", 84, 12, 10],
      ["Energy", 86, 40, 44],
    ],
    showHeader: true,
    width: 850,
  },
  argTypes: {
    label: text("Accessible table name."),
    headers: object("Exactly four column labels."),
    rows: object("Rows of four cells; first cell is the row header."),
    showHeader: flag("Display column headings.", "Content"),
    width: range(480, 1100, 20, "Maximum ledger width."),
  },
  render: (a) => {
    if (
      !Array.isArray(a.headers) ||
      a.headers.length !== 4 ||
      !Array.isArray(a.rows) ||
      a.rows.some((r) => !Array.isArray(r) || r.length !== 4)
    )
      return '<p role="alert">Use four headers and four cells in each row.</p>';
    return `<div class="rw-ledger" role="table" aria-label="${e(a.label)}" style="max-inline-size:${bounded(a.width, 480, 1100)}px">${a.showHeader ? `<div class="rw-ledger__row" data-heading role="row">${a.headers.map((h) => `<span role="columnheader">${e(h)}</span>`).join("")}</div>` : ""}${a.rows
      .map(
        (r) =>
          `<div class="rw-ledger__row" role="row"><strong role="rowheader">${e(r[0])}</strong>${r
            .slice(1)
            .map((v) => `<span role="cell">${e(v)}</span>`)
            .join("")}</div>`,
      )
      .join("")}</div>`;
  },
};
for (const story of [ResourceHUD, EquipmentSlots, Objectives, Choice, ActionDock, ProductionLedger])
  story.argTypes = withDefaults(story.args, story.argTypes);
