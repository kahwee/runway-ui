import cloud from "../examples/assets/view-tabs/cloud.svg?url";
import cottage from "../examples/assets/view-tabs/cottage.svg?url";
import garden from "../examples/assets/view-tabs/garden.svg?url";
import letters from "../examples/assets/view-tabs/letters.svg?url";
import pantry from "../examples/assets/view-tabs/pantry.svg?url";
import picnic from "../examples/assets/view-tabs/picnic.svg?url";
import {
  escapeHTML as e,
  exclusive,
  flag,
  object,
  range,
  select,
  withDefaults,
} from "./helpers.js";

const art = [cottage, garden, letters, pantry, cloud, picnic];
const args = {
  labels: ["Home", "Garden", "Letters", "Pantry", "Weather", "Picnic"],
  selected: 0,
  disabled: -1,
  layout: "stacked",
  illustrationSize: 48,
};
export default {
  title: "Game patterns/Illustrated navigation",
  tags: ["autodocs"],
  args,
  parameters: {
    docs: {
      description: {
        component:
          'A shared workspace navigation pattern with original vector miniatures. Native buttons retain keyboard behavior; the host owns routing and selected state. Use native links and aria-current="page" for destinations. This preview uses aria-pressed for application-owned selection; it is not an ARIA tablist.',
      },
    },
  },
  argTypes: withDefaults(args, {
    labels: object("One to six visible destination names. Try long names to inspect wrapping."),
    selected: range(0, 5, 1, "Selected destination; application-owned state.", "State"),
    disabled: range(-1, 5, 1, "Disabled destination, or -1 for none.", "State"),
    layout: select(["stacked", "inline"], "Illustration above or beside the label."),
    illustrationSize: range(32, 64, 4, "--rw-view-art in pixels."),
  }),
};
export const Playground = {
  render: (a) =>
    !Array.isArray(a.labels) || !a.labels.length || a.labels.length > 6
      ? '<p role="alert">Supply one to six labels.</p>'
      : exclusive(
          `<section class="rw-panel"><nav class="rw-view-tabs" data-layout="${a.layout === "inline" ? "inline" : "stacked"}" aria-label="Daily places" style="--rw-view-art:${Math.max(32, Math.min(64, Number(a.illustrationSize) || 48))}px">${a.labels.map((label, i) => `<button type="button" class="rw-view-tab" aria-pressed="${i === a.selected}"${i === a.disabled ? " disabled" : ""}><img class="rw-view-tab__art" src="${art[i]}" width="48" height="48" alt=""><span>${e(label)}</span></button>`).join("")}</nav></section>`,
          ".rw-view-tab",
        ),
};

const sectionArgs = {
  labels: ["Build & portfolio", "Explore markets", "Trends & reports", "Story"],
  selected: 0,
  sticky: true,
  variant: "primary",
};
export const SectionTabs = {
  name: "Section tabs",
  args: sectionArgs,
  argTypes: withDefaults(sectionArgs, {
    labels: object("One to six visible section names."),
    selected: range(0, 5, 1, "Selected section; application-owned state.", "State"),
    sticky: flag("Pin the row to the top of its scroll container.", "Layout"),
    variant: select(["primary", "secondary"], "Variant of the selected button."),
  }),
  parameters: {
    docs: {
      description: {
        story:
          "A compact row of toggle buttons for sibling views in one workspace. Native buttons with aria-pressed; the host owns routing and selected state. Not an ARIA tablist.",
      },
    },
  },
  render: (a) =>
    !Array.isArray(a.labels) || !a.labels.length || a.labels.length > 6
      ? '<p role="alert">Supply one to six labels.</p>'
      : exclusive(
          `<section class="rw-panel"><nav class="rw-section-tabs"${a.sticky ? " data-sticky" : ""} aria-label="Workspace sections">${a.labels.map((label, i) => `<button type="button" class="rw-button" data-variant="${i === a.selected ? (a.variant === "secondary" ? "secondary" : "primary") : "secondary"}" aria-pressed="${i === a.selected}">${e(label)}</button>`).join("")}</nav><p>Section content goes here.</p></section>`,
          ".rw-section-tabs .rw-button",
        ),
};
