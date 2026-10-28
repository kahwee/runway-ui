import { bounded, escapeHTML as e, flag, range, select, text } from "../helpers.js";
import "./theme-playground.css";

export default {
  title: "Start here/Theme playground",
  tags: ["autodocs"],
  args: {
    title: "Prepare the expedition",
    description: "Review the supplies and crew before departure.",
    resourceLabel: "Supplies available",
    resourceValue: "2,840",
    progress: 64,
    actionLabel: "Confirm plan",
    status: "Ready",
    tone: "neutral",
    disabled: false,
    showDetails: true,
    width: 640,
    elevation: "raised",
  },
  argTypes: {
    title: text("Panel heading. Try long titles to check wrapping."),
    description: text("Supporting context."),
    resourceLabel: text("Meaning of the displayed value."),
    resourceValue: text("Host-formatted value; no numeric coercion."),
    progress: range(0, 100, 1, "Preparation percentage."),
    actionLabel: text("Primary action label."),
    status: text("Status badge text; do not rely on color alone."),
    tone: select(["neutral", "warning", "danger"], "Status color role."),
    disabled: flag("Disable the native primary action."),
    showDetails: flag("Include a native disclosure."),
    width: range(320, 960, 20, "Allocated panel width, in pixels."),
    elevation: select(["raised", "flat"], "Panel elevation."),
  },
  parameters: {
    docs: {
      description: {
        component:
          "One composition for testing themes and states. Choose Studio / Light, Orbital / Dark or Midnight / Black in the theme toolbar; density and depth use the same global controls as component stories. Change content and width to check wrapping. The primary action confirms locally and never submits data.",
      },
    },
  },
};
export const Playground = {
  render: (a) => {
    const root = document.createElement("main");
    root.className = "theme-playground";
    root.style.maxInlineSize = `${bounded(a.width, 320, 960, 640)}px`;
    root.innerHTML = `<section class="rw-panel" data-elevation="${e(a.elevation)}"><header class="rw-panel__header"><p class="rw-kicker">Expedition planning</p><span class="rw-badge" data-tone="${e(a.tone)}">${e(a.status)}</span></header><h1 class="rw-panel__title">${e(a.title)}</h1><p class="rw-muted">${e(a.description)}</p><div class="rw-resource"><span class="rw-icon" data-icon="package" aria-hidden="true"></span><div><strong>${e(a.resourceValue)}</strong><small>${e(a.resourceLabel)}</small></div></div><label class="theme-progress">Preparation · ${bounded(a.progress, 0, 100, 64)}%<progress max="100" value="${bounded(a.progress, 0, 100, 64)}"></progress></label>${a.showDetails ? '<details class="rw-disclosure"><summary>What happens next?</summary><div><p>Confirmation records the plan in this preview. Your application owns the next step.</p></div></details>' : ""}<footer><button type="button" class="rw-button" data-variant="primary"${a.disabled ? " disabled" : ""}>${e(a.actionLabel)}</button><span role="status" aria-live="polite"></span></footer></section>`;
    root.querySelector("button").addEventListener("click", () => {
      root.querySelector('[role="status"]').textContent = "Plan confirmed in this preview.";
    });
    return root;
  },
};
