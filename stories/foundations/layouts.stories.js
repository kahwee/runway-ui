import {
  bounded,
  escapeHTML as e,
  flag,
  range,
  select,
  text,
  uniqueId,
  withDefaults,
} from "../helpers.js";

const args = {
  pattern: "cards",
  columns: 3,
  width: 1040,
  longContent: true,
  showHints: true,
  direction: "ltr",
  actionLabel: "Review plan",
  caption: "Small plans, neatly lined up.",
};
export default {
  title: "Foundations/Subgrid layouts",
  tags: ["autodocs"],
  args,
  parameters: {
    docs: {
      description: {
        component:
          "Shared parent tracks align nested content. Resize the container and change copy length; no fixed card or field heights.",
      },
    },
  },
  argTypes: withDefaults(args, {
    pattern: select(["cards", "form", "stats", "choices"], "Choose a public layout pattern."),
    columns: range(
      1,
      4,
      1,
      "Preferred columns. Container queries adapt cards, stats and forms when space is tighter.",
    ),
    width: range(300, 1200, 20, "Container width, independent of the browser viewport."),
    longContent: flag(
      "Wrap selected headings, labels and descriptions to demonstrate shared track alignment.",
      "Content",
    ),
    showHints: flag("Show field hints; omitted hints preserve the shared control row.", "Content"),
    direction: select(["ltr", "rtl"], "Logical layout direction."),
    actionLabel: text("Action copy; try a long label to check wrapping.", "Content"),
    caption: text("Visible heading."),
  }),
};
export const Playground = {
  render: (a) => {
    const prefix = uniqueId("layout");
    const columns = Math.trunc(bounded(a.columns, 1, 4)),
      width = bounded(a.width, 300, 1200);
    const shell = (body) =>
      `<section class="rw-layout" dir="${e(a.direction)}" style="max-inline-size:${width}px;--rw-card-columns:${columns};--rw-form-columns:${columns};--rw-stat-columns:${columns}"><h2>${e(a.caption)}</h2>${body}</section>`;
    if (a.pattern === "form")
      return shell(
        `<form class="rw-form-grid">${["Department", "The person with the excellent clipboard", "Destination", "Priority"].map((v, i) => `<div class="rw-field"><label for="${prefix}-${i}">${e(a.longContent ? v : v.split(" ")[0])}</label><select class="rw-input" id="${prefix}-${i}"><option>Research & improbable inventions</option><option>Operations & tea logistics</option></select>${a.showHints ? `<small>${i === 1 && a.longContent ? "Someone needs to take the minutes. We hear the clipboard is very persuasive." : "Choose a sensible starting point."}</small>` : ""}</div>`).join("")}</form>`,
      );
    if (a.pattern === "stats")
      return shell(
        `<div class="rw-stat-grid">${["Supplies", "Meetings that could have been a note", "Crew", "Readiness"].map((v, i) => `<article class="rw-panel rw-stat"><span class="rw-stat__label">${e(a.longContent ? v : v.split(" ")[0])}</span><strong class="rw-stat__value">${["1,240", "12", "48", "82%"][i]}</strong><small class="rw-stat__detail">${i === 1 ? "The clipboard committee is investigating." : "Compared with last cycle"}</small></article>`).join("")}</div>`,
      );
    if (a.pattern === "choices")
      return shell(
        `<div class="rw-choice-list">${["Prepare the expedition", "Order a sensible quantity of biscuits", "Upgrade the equipment"].map((v, i) => `<button type="button" class="rw-choice"><span><strong>${e(a.longContent ? v : v.split(" ")[0])}</strong><small>A little planning goes a long way.</small></span><span>${[120, 18, 640][i]} credits</span></button>`).join("")}</div>`,
      );
    return shell(
      `<div class="rw-card-grid">${["A small improvement", "An ambitious and rather elaborate expedition", "A backup kettle"].map((v, i) => `<article class="rw-panel rw-card"><h3 class="rw-card__title">${e(a.longContent ? v : v.split(" ")[0])}</h3><p class="rw-card__description">${i === 1 && a.longContent ? "A longer description keeps the important context visible. Neighboring cards still line up, all the way down to their actions." : "A practical addition to the plan."}</p><div class="rw-card__body"><span class="rw-badge">${["Ready", "Under consideration", "Essential, apparently"][i]}</span></div><footer class="rw-card__footer"><button type="button" class="rw-button" data-variant="primary">${e(a.actionLabel)}</button></footer></article>`).join("")}</div>`,
    );
  },
};
