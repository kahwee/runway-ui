import {
  escapeHTML as e,
  bounded,
  text,
  flag,
  select,
  range,
  uniqueId,
  withDefaults,
} from "./helpers.js";
export default {
  title: "Foundations/Controls",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Each playground exposes the public class, native HTML attributes and theme tokens it actually uses. Toolbar theme and density apply to every example.",
      },
    },
  },
};
export const Button = {
  args: {
    label: "Launch expedition",
    variant: "primary",
    size: "md",
    disabled: false,
    block: false,
    pressed: "unset",
    busy: false,
    shortcut: "",
  },
  argTypes: {
    label: text("Visible button text."),
    shortcut: text(
      "Optional keyboard hint; binding the shortcut belongs to the application.",
    ),
    variant: select(
      ["neutral", "primary", "secondary", "danger"],
      "data-variant chooses the color role.",
    ),
    size: select(
      ["sm", "md", "lg"],
      "data-size controls padding and font size.",
    ),
    disabled: flag("Native disabled attribute prevents activation."),
    block: flag("data-block fills the available inline width.", "Layout"),
    pressed: select(
      ["unset", "true", "false"],
      "Set aria-pressed only for toggle actions.",
      "State",
    ),
    busy: flag(
      "aria-busy announces a pending update; does not disable activation.",
    ),
  },
  render: (a) =>
    `<button class="rw-button" type="button" data-variant="${e(a.variant)}" data-size="${e(a.size)}"${a.disabled ? " disabled" : ""}${a.block ? " data-block" : ""}${a.pressed !== "unset" ? ` aria-pressed="${e(a.pressed)}"` : ""}${a.busy ? ' aria-busy="true"' : ""}>${e(a.label)}${a.shortcut ? ` <kbd class="rw-shortcut">${e(a.shortcut)}</kbd>` : ""}</button>`,
};
export const Panel = {
  args: {
    title: "Production overview",
    description: "Resources, capacity and the next decision.",
    eyebrow: "Operations",
    elevation: "raised",
    padding: 22,
    width: 640,
    showBadge: true,
    badge: "Operational",
  },
  argTypes: {
    title: text("Visible section heading."),
    description: text("Body text; rendered as text, never HTML."),
    eyebrow: text("Optional kicker above the heading."),
    elevation: select(
      ["raised", "flat"],
      "data-elevation removes the shadow in flat mode.",
    ),
    padding: range(8, 48, 2, "--rw-panel-padding, in CSS pixels."),
    width: range(320, 1000, 20, "Maximum panel width in the preview."),
    showBadge: flag("Show the status badge.", "Content"),
    badge: { ...text("Visible status label."), if: { arg: "showBadge" } },
  },
  render: (a) =>
    `<section class="rw-panel rw-stack" data-elevation="${e(a.elevation)}" style="--rw-panel-padding:${bounded(a.padding, 8, 48)}px;max-inline-size:${bounded(a.width, 320, 1000)}px">${a.eyebrow ? `<p class="rw-kicker">${e(a.eyebrow)}</p>` : ""}<header class="rw-panel__header"><h2>${e(a.title)}</h2>${a.showBadge ? `<span class="rw-badge">${e(a.badge)}</span>` : ""}</header><p>${e(a.description)}</p></section>`,
};
export const Badge = {
  args: { label: "Low reserves", tone: "warning" },
  argTypes: {
    label: text(
      "Meaningful text; never communicate status through color alone.",
    ),
    tone: select(
      ["neutral", "warning", "danger"],
      "data-tone chooses a semantic color.",
    ),
  },
  render: (a) =>
    `<span class="rw-badge" data-tone="${e(a.tone)}">${e(a.label)}</span>`,
};
export const Input = {
  args: {
    label: "Expedition name",
    value: "Northern survey",
    placeholder: "Give the expedition a name",
    type: "text",
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    hint: "Use a name your crew will recognize.",
    error: "Enter a valid expedition name.",
    width: 480,
    nativeSkin: false,
  },
  argTypes: {
    nativeSkin: flag(
      "Use rw-native on the field group instead of rw-input on the control.",
      "HTML",
    ),
    label: text("Native associated label."),
    value: text("Initial value; user editing remains native."),
    placeholder: text("Supplementary placeholder, not a label."),
    type: select(
      ["text", "email", "number", "search"],
      "Native input type.",
      "HTML",
    ),
    disabled: flag("Native disabled state."),
    readonly: flag("Native readonly state."),
    required: flag("Native required constraint."),
    invalid: flag("aria-invalid=true plus associated error text."),
    hint: text("Hint associated through aria-describedby."),
    error: {
      ...text("Error text shown only when invalid."),
      if: { arg: "invalid" },
    },
    width: range(240, 850, 10, "Maximum field group width."),
  },
  render: (a) => {
    const id = uniqueId("field");
    return `<div class="rw-stack${a.nativeSkin ? " rw-native" : ""}" style="max-inline-size:${bounded(a.width, 240, 850)}px"><label for="${id}">${e(a.label)}</label><input${a.nativeSkin ? "" : ' class="rw-input"'} id="${id}" type="${e(a.type)}" value="${e(a.value)}" placeholder="${e(a.placeholder)}" aria-describedby="${id}-hint"${a.disabled ? " disabled" : ""}${a.readonly ? " readonly" : ""}${a.required ? " required" : ""}${a.invalid ? ' aria-invalid="true"' : ""}><small id="${id}-hint">${e(a.invalid ? a.error : a.hint)}</small></div>`;
  },
};
export const Progress = {
  args: {
    label: "Readiness",
    value: 68,
    maximum: 100,
    tone: "neutral",
    height: 8,
    showValues: true,
    native: false,
  },
  argTypes: {
    label: text("Accessible name and visible label."),
    value: range(0, 100, 1, "Current value, bounded by maximum.", "Data"),
    maximum: range(
      1,
      100,
      1,
      "Positive maximum; fill and text share this scale.",
      "Data",
    ),
    tone: select(
      ["neutral", "warning", "danger", "energy", "morale"],
      "Semantic data-tone for the custom meter.",
    ),
    height: {
      ...range(4, 24, 1, "--rw-meter-height in CSS pixels."),
      if: { arg: "native", truthy: false },
    },
    showValues: flag("Keep the numeric value visible.", "Content"),
    native: flag("Compare with an actual HTML progress element.", "HTML"),
  },
  render: (a) => {
    const max = bounded(a.maximum, 1, 100, 100),
      value = bounded(a.value, 0, max);
    return a.native
      ? `<label>${e(a.label)} <progress max="${max}" value="${value}">${value} / ${max}</progress>${a.showValues ? ` ${value} / ${max}` : ""}</label>`
      : `<div class="rw-meter story-width" data-tone="${e(a.tone)}" style="--rw-meter-height:${bounded(a.height, 4, 24)}px"><div class="rw-meter__label"><span>${e(a.label)}</span>${a.showValues ? `<span>${value} / ${max}</span>` : ""}</div><div class="rw-meter__track" role="progressbar" aria-label="${e(a.label)}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="${max}"><div class="rw-meter__fill" style="--rw-value:${(value / max) * 100}%"></div></div></div>`;
  },
};
export const Disclosure = {
  args: {
    summary: "Production modifiers",
    content:
      "Weather improves output by 10%. Maintenance reduces output by 5%.",
    open: false,
  },
  argTypes: {
    summary: text("Native summary label."),
    content: text("Visible disclosed content."),
    open: flag("Initial native open attribute; the user can still toggle it."),
  },
  render: (a) =>
    `<details class="rw-disclosure story-width"${a.open ? " open" : ""}><summary>${e(a.summary)}</summary><p>${e(a.content)}</p></details>`,
};

const optionStyles = ["plain", "icons", "descriptions", "dots", "avatars", "rich"];
const sampleIcons = ["🚀", "🧁", "🛰️", "🎲", "🪴", "🔮", "🧪", "🎈", "🍉", "🛼", "🪁", "🧩"];
const sampleColors = ["#6a4cff", "#ff6b9d", "#1fb58f", "#ffb000", "#3aa0ff", "#e5533a"];
const sampleNotes = ["Ships at suspicious speed", "Prototypes and sprinkles", "Listens to the internet", "Breaks things on purpose, kindly", "Quiet focus and good lighting", "Predicts the weather, mostly"];
const initials = (label) => label.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
export const Select = {
  args: {
    label: "Which team are you joining?",
    options: "Rocket crew\nCupcake lab\nSignal desk\nChaos garden\nCalm corner",
    selected: 0, hint: "Open it, hover the options and use the arrow keys.", width: 460,
    optionStyle: "rich", variant: "soft", size: "md", shape: "round", tone: "grape",
    density: "comfortable", pickerColumns: 1, groups: false, disabledOptions: 0, placeholder: "",
    checkmark: true, stagger: true,
    arrowInset: 16, direction: "ltr", disabled: false, invalid: false, required: false,
    multiple: false, nativeSkin: false, picker: "default",
  },
  argTypes: {
    label: text("Associated native label.", "Content"),
    options: text("One option per line, at most 12.", "Content"),
    selected: range(0, 11, 1, "Initial selected option index.", "Content"),
    hint: text("Help associated with the field.", "Content"),
    placeholder: text("Optional disabled first option shown until a choice is made (also makes the field required).", "Content"),
    optionStyle: select(optionStyles, "How options are dressed: plain text, emoji icons, descriptions, colour dots (typed attr()), avatars or all of it.", "Options"),
    groups: flag("Wrap options in two optgroups with legends.", "Options"),
    disabledOptions: range(0, 4, 1, "Disable this many options from the end.", "Options"),
    variant: select(["soft", "filled", "outline", "ghost"], "Trigger look. Sets data-variant.", "Look"),
    size: select(["sm", "md", "lg"], "Trigger size. Sets data-size.", "Look"),
    shape: select(["round", "pill", "square"], "Corner shape for trigger, picker and options. Sets data-shape.", "Look"),
    tone: select(["grape", "coral", "mint", "sky", "sun"], "Accent for this select only. Sets data-tone.", "Look"),
    density: select(["comfortable", "compact", "roomy"], "Option spacing. Sets data-density.", "Look"),
    pickerColumns: range(1, 3, 1, "Lay options out in columns. Sets data-columns.", "Look"),
    checkmark: flag("Show the selected check badge. Sets data-checkmark=off when false.", "Motion"),
    stagger: flag("Stagger options in with sibling-index(). Sets data-stagger=off when false.", "Motion"),
    width: range(180, 700, 10, "Field width; try long labels at 180px.", "Layout"),
    arrowInset: range(10, 28, 1, "--rw-select-inset. Distance between arrow and inline edge (non-customizable fallback).", "Layout"),
    direction: select(["ltr", "rtl"], "Direction changes arrow placement and text alignment.", "HTML"),
    disabled: flag("Native disabled control.", "State"),
    invalid: flag("aria-invalid and border state.", "State"),
    required: flag("Native required constraint.", "State"),
    multiple: flag("Native multi-select/listbox; never draws a dropdown arrow.", "HTML"),
    nativeSkin: flag("Use rw-native instead of an explicit rw-input class.", "HTML"),
    picker: select(["default", "native"], "Default is the customizable picker where supported (Chrome 135+); native opts out with data-picker=native.", "HTML"),
  },
  parameters: { docs: { description: { story: "One playground for the whole select. The customizable picker (appearance: base-select) is the default; variants only set data attributes, so the markup stays a plain native select. Browsers without support show the padded native select." } } },
  render: (a) => {
    const id = uniqueId("select");
    const labels = String(a.options).split("\n").map((v) => v.trim()).filter(Boolean).slice(0, 12);
    const index = Math.trunc(bounded(a.selected, 0, Math.max(0, labels.length - 1)));
    const style = a.optionStyle;
    const firstDisabled = labels.length - Math.round(bounded(a.disabledOptions, 0, 4));
    const option = (label, i) => {
      const icon = `<span class="rw-option__icon" aria-hidden="true">${sampleIcons[i % sampleIcons.length]}</span>`;
      const avatar = `<span class="rw-option__avatar" aria-hidden="true" style="background:${sampleColors[i % sampleColors.length]}">${e(initials(label))}</span>`;
      const copy = (note) => `<span><strong>${e(label)}</strong>${note ? `<small>${e(sampleNotes[i % sampleNotes.length])}</small>` : ""}</span>`;
      const lead = style === "icons" || style === "rich" || style === "descriptions" ? icon : style === "avatars" ? avatar : "";
      const body = style === "descriptions" || style === "rich" || style === "avatars" ? copy(true) : e(label);
      const attrs = `${!a.placeholder && i === index ? " selected" : ""}${i >= firstDisabled ? " disabled" : ""}${style === "dots" || style === "rich" ? ` data-color="${sampleColors[i % sampleColors.length]}"` : ""}`;
      return `<option${attrs}>${lead}${body}</option>`;
    };
    const items = labels.map(option);
    const half = Math.ceil(items.length / 2);
    const body = a.groups ? `<optgroup label="First crew"><legend>First crew</legend>${items.slice(0, half).join("")}</optgroup><optgroup label="Second crew"><legend>Second crew</legend>${items.slice(half).join("")}</optgroup>` : items.join("");
    const placeholder = a.placeholder ? `<option value="" selected disabled hidden>${e(a.placeholder)}</option>` : "";
    const rich = style !== "plain" && !a.multiple ? "<button><selectedcontent></selectedcontent></button>" : "";
    const attrs = [
      a.nativeSkin ? "" : ' class="rw-input"',
      a.picker === "native" ? ' data-picker="native"' : "",
      a.variant !== "soft" ? ` data-variant="${a.variant}"` : "",
      a.size !== "md" ? ` data-size="${a.size}"` : "",
      a.shape !== "round" ? ` data-shape="${a.shape}"` : "",
      a.tone !== "grape" ? ` data-tone="${a.tone}"` : "",
      a.density !== "comfortable" ? ` data-density="${a.density}"` : "",
      a.pickerColumns > 1 ? ` data-columns="${Math.round(a.pickerColumns)}"` : "",
      a.checkmark ? "" : ' data-checkmark="off"',
      a.stagger ? "" : ' data-stagger="off"',
      a.disabled ? " disabled" : "",
      a.required || a.placeholder ? " required" : "",
      a.invalid ? ' aria-invalid="true"' : "",
      a.multiple ? ' size="4" multiple' : "",
    ].join("");
    return `<div class="rw-stack${a.nativeSkin ? " rw-native" : ""}" dir="${e(a.direction)}" style="max-inline-size:${bounded(a.width, 180, 700)}px;--rw-select-inset:${bounded(a.arrowInset, 10, 28)}px"><label for="${id}">${e(a.label)}</label><select id="${id}"${attrs} aria-describedby="${id}-hint">${rich}${placeholder}${body}</select><small class="rw-muted" id="${id}-hint">${e(a.hint)}</small></div>`;
  },
};
for (const story of [Button, Panel, Badge, Input, Select, Progress, Disclosure])
  story.argTypes = withDefaults(story.args, story.argTypes);
