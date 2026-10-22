/** Documentation utilities, never imported by the runtime library. */
export const escapeHTML = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char],
  );
export const bounded = (value, min, max, fallback = min) =>
  Number.isFinite(Number(value)) ? Math.min(max, Math.max(min, Number(value))) : fallback;
export const text = (description, category = "Content") => ({
  control: "text",
  description,
  table: { category, type: { summary: "string" } },
});
export const flag = (description, category = "State") => ({
  control: "boolean",
  description,
  table: { category, type: { summary: "boolean" } },
});
export const select = (options, description, category = "Appearance") => ({
  control: "select",
  options,
  description,
  table: { category, type: { summary: options.join(" | ") } },
});
export const range = (min, max, step, description, category = "Layout") => ({
  control: { type: "range", min, max, step },
  description,
  table: { category, type: { summary: "number" } },
});
export const object = (description, category = "Data") => ({
  control: "object",
  description,
  table: { category, type: { summary: "array" } },
});
export const withDefaults = (args, argTypes) =>
  Object.fromEntries(
    Object.entries(argTypes).map(([name, type]) => [
      name,
      {
        ...type,
        table: {
          ...type.table,
          defaultValue: {
            summary:
              typeof args[name] === "object" ? JSON.stringify(args[name]) : String(args[name]),
          },
        },
      },
    ]),
  );
export const meta = (title, description, args, argTypes) => ({
  title,
  tags: ["autodocs"],
  args,
  argTypes: withDefaults(args, argTypes),
  parameters: {
    docs: {
      description: { component: description },
      source: { type: "dynamic", language: "html" },
    },
    controls: { expanded: true, sort: "none" },
  },
});
let sequence = 0;
export const uniqueId = (prefix) => `${prefix}-${++sequence}`;

/** Phosphor icon name -> icon markup; any other string is escaped text. */
export const iconHTML = (value, weight = "duotone") =>
  /^[a-z][a-z-]*$/.test(String(value ?? ""))
    ? `<span class="rw-icon" data-icon="${value}" data-weight="${weight}" aria-hidden="true"></span>`
    : escapeHTML(value);

/**
 * Make the single-select buttons or links inside rendered markup respond to clicks, so a story
 * shows the real selection animation. Application-owned state in a real interface.
 */
export const exclusive = (markup, itemSelector, selectedAttr = "aria-pressed") => {
  const root = document.createElement("div");
  root.innerHTML = markup;
  const items = [...root.querySelectorAll(itemSelector)];
  const variant = items.find((item) => item.getAttribute(selectedAttr) === "true")?.dataset.variant;
  root.addEventListener("click", (event) => {
    const item = event.target.closest(itemSelector);
    if (!item || item.disabled || !root.contains(item)) return;
    event.preventDefault();
    for (const other of items) {
      const on = other === item;
      other.setAttribute(selectedAttr, String(on));
      if (selectedAttr === "aria-current") {
        if (on) other.setAttribute("aria-current", "page");
        else other.removeAttribute("aria-current");
      }
      if (variant) other.dataset.variant = on ? variant : "secondary";
    }
  });
  return root;
};
