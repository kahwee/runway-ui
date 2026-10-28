import { escapeHTML as e, exclusive, flag, object, range, text, withDefaults } from "../helpers.ts";

const args = {
  label: "Pace",
  items: ["Care", "Steady", "Push"],
  tones: ["good", "good", "warm"],
  selected: 1,
  disabled: -1,
  showLabel: true,
};
export default {
  title: "Game patterns/Segmented control",
  tags: ["autodocs"],
  args,
  parameters: {
    docs: {
      description: {
        component:
          'A sunken pill track of mutually exclusive native buttons, such as game speed or a view density. Selection is application-owned aria-pressed state; this is a toggle group, not an ARIA tablist or radio group. Selected segments squash, stretch and land; motion is disabled under prefers-reduced-motion. Give a segment data-tone="warm" or "danger" to tint it.',
      },
    },
  },
  argTypes: withDefaults(args, {
    label: text("Visible and accessible name of the group."),
    items: object("Two to six segment labels."),
    tones: object("Optional tone per segment: good, warm or danger."),
    selected: range(-1, 5, 1, "Selected segment; application-owned state.", "State"),
    disabled: range(-1, 5, 1, "Disabled segment, or -1 for none.", "State"),
    showLabel: flag("Show the label inside the track.", "Content"),
  }),
};
const render = (a) =>
  !Array.isArray(a.items) || a.items.length < 2 || a.items.length > 6
    ? '<p role="alert">Supply two to six items.</p>'
    : exclusive(
        `<div class="rw-segmented" role="group" aria-label="${e(a.label)}">${a.showLabel ? `<span class="rw-segmented__label" aria-hidden="true">${e(a.label)}</span>` : ""}${a.items.map((item, i) => `<button type="button" class="rw-segment" aria-pressed="${i === a.selected}"${a.tones?.[i] === "warm" || a.tones?.[i] === "danger" ? ` data-tone="${a.tones[i]}"` : ""}${i === a.disabled ? " disabled" : ""}>${e(item)}</button>`).join("")}</div>`,
        ".rw-segment",
      );
export const Playground = { render };
export const Variations = {
  name: "Stress cases",
  parameters: { controls: { disable: true } },
  render: () => {
    const root = document.createElement("div");
    root.style.cssText = "display:grid;gap:18px;justify-items:start";
    root.append(
      ...[
        { label: "Speed", items: ["1×", "2×", "4×"], selected: 0 },
        { label: "Two options", items: ["Light", "Dark"], selected: 1, showLabel: false },
        {
          label: "Six segments",
          items: ["Day", "Week", "Month", "Quarter", "Year", "All time"],
          selected: 2,
          showLabel: true,
        },
        {
          label: "Long labels wrap rather than overflow",
          items: ["A rather long segment name", "Another considerably longer name", "Short"],
          selected: 1,
          showLabel: true,
        },
        {
          label: "Danger",
          items: ["Safe", "Risky", "Reckless"],
          tones: ["good", "warm", "danger"],
          selected: 2,
          showLabel: true,
        },
        {
          label: "Disabled",
          items: ["One", "Two", "Three"],
          selected: 0,
          disabled: 1,
          showLabel: true,
        },
      ].map((a) => render({ tones: [], disabled: -1, ...a })),
    );
    return root;
  },
};
