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

export const Select = {
  args: {
    label:"Who gets the good clipboard?", options:"Research & improbable inventions\nOperations & tea logistics\nAccounts & biscuit procurement",
    selected:0, hint:"A native select with a little breathing room.", width:420,
    arrowInset:16, direction:"ltr", disabled:false, invalid:false, required:false,
    multiple:false, nativeSkin:false, picker:"native",
  },
  argTypes: {
    label:text("Associated native label."), options:text("One option per line, at most 12."),
    selected:range(0,11,1,"Initial selected option index.","Data"),
    hint:text("Help associated with the field."), width:range(180,700,10,"Field width; try long labels at 180px."),
    arrowInset:range(10,28,1,"--rw-select-inset. Distance between arrow and inline edge."),
    direction:select(["ltr","rtl"],"Direction changes arrow placement and text alignment.","HTML"),
    disabled:flag("Native disabled control."),invalid:flag("aria-invalid and border state."),required:flag("Native required constraint."),
    multiple:flag("Native multi-select/listbox; never draws a dropdown arrow.","HTML"),
    nativeSkin:flag("Use rw-native instead of an explicit rw-input class.","HTML"),
    picker:select(["native","enhanced"],"Opt into base-select where supported; fallback remains native.","HTML"),
  },
  render:a=>{
    const id=uniqueId("select"),options=String(a.options).split("\n").map(v=>v.trim()).filter(Boolean).slice(0,12);
    const index=Math.trunc(bounded(a.selected,0,Math.max(0,options.length-1)));
    return `<div class="rw-stack${a.nativeSkin?' rw-native':''}" dir="${e(a.direction)}" style="max-inline-size:${bounded(a.width,180,700)}px;--rw-select-inset:${bounded(a.arrowInset,10,28)}px"><label for="${id}">${e(a.label)}</label><select id="${id}"${a.nativeSkin?'':' class="rw-input"'} data-picker="${e(a.picker)}" aria-describedby="${id}-hint"${a.disabled?' disabled':''}${a.required?' required':''}${a.invalid?' aria-invalid="true"':''}${a.multiple?' multiple size="3"':''}>${options.map((v,i)=>`<option${i===index?' selected':''}>${e(v)}</option>`).join('')}</select><small class="rw-muted" id="${id}-hint">${e(a.hint)}</small></div>`;
  },
};
for (const story of [Button, Panel, Badge, Input, Select, Progress, Disclosure])
  story.argTypes = withDefaults(story.args, story.argTypes);

export const FunPicker = {
  args: { direction: "ltr", width: 460, disabled: false },
  argTypes: {
    direction: select(["ltr", "rtl"], "Text direction.", "HTML"),
    width: range(240, 700, 10, "Field width."),
    disabled: flag("Native disabled control."),
  },
  parameters: { docs: { description: { story: "Customizable select (appearance: base-select): rich options, selectedcontent mirror, staggered entry with sibling-index(), spring checkmark and typed attr() colour dots. Chrome 135+ today; other browsers keep the native select." } } },
  render: (a) => {
    const id = uniqueId("fun");
    const opt = (icon, name, desc, color, sel) => `<option value="${name.toLowerCase().replace(/\W+/g, "-")}" data-color="${color}"${sel ? " selected" : ""}><span class="rw-option__icon" aria-hidden="true">${icon}</span><span><strong>${e(name)}</strong><small>${e(desc)}</small></span></option>`;
    return `<div class="rw-stack" dir="${e(a.direction)}" style="max-inline-size:${bounded(a.width, 240, 700)}px"><label for="${id}">Which team are you joining?</label><select class="rw-input" id="${id}" data-picker="enhanced"${a.disabled ? " disabled" : ""}><button><selectedcontent></selectedcontent></button>${opt("🚀", "Rocket crew", "Ships things at suspicious speed", "#6a4cff", true)}${opt("🧁", "Cupcake lab", "Prototypes, sprinkles and spreadsheets", "#ff6b9d")}${opt("🛰️", "Signal desk", "Listens to the whole internet", "#1fb58f")}${opt("🎲", "Chaos garden", "Breaks things on purpose, kindly", "#ffb000")}${opt("🪴", "Calm corner", "Quiet focus and good lighting", "#3aa0ff")}</select><small class="rw-muted">Open it and hover the options.</small></div>`;
  },
};
