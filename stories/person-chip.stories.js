import {
  escapeHTML as e,
  exclusive,
  flag,
  object,
  range,
  select,
  withDefaults,
} from "./helpers.js";

const hues = ["#c2603f", "#4f7fa8", "#7a8f3a", "#9a6bb0", "#b8851f", "#3a9a8f"];
const statuses = ["ok", "busy", "away", "alert"];
const initials = (name) =>
  String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
const args = {
  people: ["Ada Lane", "Ben Ortiz", "Chi Wen", "Dara Quinn", "Eli Moss", "Faye Brandt"],
  roles: ["Engineer", "Designer", "Planner", "Support", "Engineer", "Manager"],
  selected: 0,
  layout: "inline",
  shape: "tile",
  showStatus: true,
};
export default {
  title: "Game patterns/Person chip",
  tags: ["autodocs"],
  args,
  parameters: {
    docs: {
      description: {
        component:
          "A native button for picking a person, character or account: a tinted avatar, an optional name and role, and a status dot. Avatars take any colour through --rw-avatar-hue and hold initials, an image or an icon. Selection is application-owned aria-pressed state; chips lift, tilt their avatar on hover and pop when selected.",
      },
    },
  },
  argTypes: withDefaults(args, {
    people: object("Names; initials are derived."),
    roles: object("Optional small line under each name, inline layout only."),
    selected: range(-1, 11, 1, "Selected chip; application-owned state.", "State"),
    layout: select(["inline", "compact"], "Name beside the avatar, or an avatar-only chip."),
    shape: select(["tile", "round"], "Avatar shape."),
    showStatus: flag("Show a status dot.", "Content"),
  }),
};
const chips = (a) =>
  (a.people ?? [])
    .map(
      (name, i) =>
        `<button type="button" class="rw-person-chip" aria-pressed="${i === a.selected}"${a.layout === "inline" ? ' data-layout="inline"' : ` aria-label="${e(name)}${a.roles?.[i] ? `, ${e(a.roles[i])}` : ""}" title="${e(name)}"`}><span class="rw-avatar" data-shape="${a.shape === "round" ? "round" : "tile"}" style="--rw-avatar-hue:${hues[i % hues.length]}" aria-hidden="true">${e(initials(name))}</span>${a.layout === "inline" ? `<span>${e(name)}${a.roles?.[i] ? `<small>${e(a.roles[i])}</small>` : ""}</span>` : ""}${a.showStatus ? `<span class="rw-person-chip__status" data-status="${statuses[i % statuses.length]}" aria-hidden="true"></span>` : ""}</button>`,
    )
    .join("");
const render = (a) =>
  !Array.isArray(a.people) || !a.people.length || a.people.length > 12
    ? '<p role="alert">Supply one to twelve names.</p>'
    : exclusive(
        `<div class="rw-person-strip" role="group" aria-label="People">${chips(a)}</div>`,
        ".rw-person-chip",
      );
export const Playground = { render };
export const Variations = {
  name: "Stress cases",
  parameters: { controls: { disable: true } },
  render: () => {
    const root = document.createElement("div");
    root.style.cssText = "display:grid;gap:22px";
    root.append(
      ...[
        { ...args, layout: "compact", selected: 2 },
        { ...args, layout: "compact", shape: "round", selected: 1 },
        { ...args, layout: "inline", showStatus: false, selected: 4 },
        {
          ...args,
          people: [
            "A Remarkably Long Surname Hyphenated-Person",
            "Ōtsuka Yūki",
            "李小龍",
            "Zoë Ångström",
          ],
          roles: ["Head of an extraordinarily long department name", "", "产品", "Ångström Labs"],
          selected: 0,
        },
        {
          ...args,
          people: Array.from(
            { length: 12 },
            (_, i) => `${String.fromCharCode(65 + i)}${String.fromCharCode(97 + i)} Person`,
          ),
          roles: [],
          layout: "compact",
          selected: 7,
        },
      ].map((a) => {
        const cell = document.createElement("div");
        cell.style.maxInlineSize = "520px";
        cell.append(render(a));
        return cell;
      }),
    );
    return root;
  },
};
