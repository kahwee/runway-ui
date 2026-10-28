/** Documentation utilities, never imported by the runtime library. */
export const escapeHTML = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char,
  );
export const bounded = (value: unknown, min: number, max: number, fallback = min) =>
  Number.isFinite(Number(value)) ? Math.min(max, Math.max(min, Number(value))) : fallback;
export const text = (description: string, category = "Content") => ({
  control: "text" as const,
  description,
  table: { category, type: { summary: "string" } },
});
export const flag = (description: string, category = "State") => ({
  control: "boolean" as const,
  description,
  table: { category, type: { summary: "boolean" } },
});
export const select = (
  options: readonly (string | number)[],
  description: string,
  category = "Appearance",
) => ({
  control: "select" as const,
  options,
  description,
  table: { category, type: { summary: options.join(" | ") } },
});
export const range = (
  min: number,
  max: number,
  step: number,
  description: string,
  category = "Layout",
) => ({
  control: { type: "range" as const, min, max, step },
  description,
  table: { category, type: { summary: "number" } },
});
export const object = (description: string, category = "Data") => ({
  control: "object" as const,
  description,
  table: { category, type: { summary: "array" } },
});
export const withDefaults = <T extends Record<string, { table?: object }>>(
  args: Record<string, unknown>,
  argTypes: T,
): T =>
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
  ) as T;
export const meta = <A extends object, T extends Record<string, { table?: object }>>(
  title: string,
  description: string,
  args: A,
  argTypes: T,
) => ({
  title,
  tags: ["autodocs"],
  args,
  argTypes: withDefaults(args as Record<string, unknown>, argTypes),
  parameters: {
    docs: {
      description: { component: description },
      source: { type: "dynamic", language: "html" },
    },
    controls: { expanded: true, sort: "none" },
  },
});
let sequence = 0;
export const uniqueId = (prefix: string) => `${prefix}-${++sequence}`;

/** Phosphor icon name -> icon markup; any other string is escaped text. */
export const iconHTML = (value: unknown, weight = "duotone") =>
  /^[a-z][a-z-]*$/.test(String(value ?? ""))
    ? `<span class="rw-icon" data-icon="${value}" data-weight="${weight}" aria-hidden="true"></span>`
    : escapeHTML(value);

/**
 * Make the single-select buttons or links inside rendered markup respond to clicks, so a story
 * shows the real selection animation. Application-owned state in a real interface.
 */
export const exclusive = (markup: string, itemSelector: string, selectedAttr = "aria-pressed") => {
  const root = document.createElement("div");
  root.innerHTML = markup;
  const items = [...root.querySelectorAll<HTMLButtonElement>(itemSelector)];
  const variant = items.find((item) => item.getAttribute(selectedAttr) === "true")?.dataset.variant;
  root.addEventListener("click", (event) => {
    const item =
      event.target instanceof Element
        ? event.target.closest<HTMLButtonElement>(itemSelector)
        : null;
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
