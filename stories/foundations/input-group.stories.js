import { escapeHTML as e, flag, select, text, uniqueId } from "../helpers.js";

export default {
  title: "Foundations/Input group",
  tags: ["autodocs"],
  args: {
    label: "Crew member name",
    value: "Alex Morgan",
    actionLabel: "Generate another name",
    variant: "secondary",
    disabled: false,
    readonly: false,
    invalid: false,
    direction: "ltr",
  },
  argTypes: {
    label: text("Associated field label."),
    value: text("Initial editable value."),
    actionLabel: text("Visible action button label."),
    variant: select(["secondary", "primary", "danger"], "Button variant."),
    disabled: flag("Disable both the input and its action."),
    readonly: flag("Make the input read-only and disable the generation action."),
    invalid: flag("Show an explicit error and associate it with the field."),
    direction: select(["ltr", "rtl"], "Logical input and action order."),
  },
  parameters: {
    docs: {
      description: {
        component:
          "A labeled native input and action button in one shared surface. The demo cycles through local sample names; applications own their actions. Use type=button for auxiliary actions, or type=submit for a form submission.",
      },
    },
  },
};

export const Playground = {
  render: (a) => {
    const id = uniqueId("input-group");
    const root = document.createElement("div");
    root.className = "rw-field story-width";
    root.dir = a.direction === "rtl" ? "rtl" : "ltr";
    root.innerHTML = `<label for="${id}">${e(a.label)}</label>
      <div class="rw-input-group">
        <input class="rw-input" id="${id}" name="crew-name" value="${e(a.value)}" aria-describedby="${id}-hint"${a.disabled ? " disabled" : ""}${a.readonly ? " readonly" : ""}${a.invalid ? ' aria-invalid="true"' : ""}>
        <button class="rw-button" type="button" data-variant="${e(a.variant)}"${a.disabled || a.readonly ? " disabled" : ""}>${e(a.actionLabel)} <span aria-hidden="true">↻</span></button>
      </div>
      <small id="${id}-hint">${a.invalid ? "Choose a different name before continuing." : "Edit the name or generate another suggestion."}</small>
      <span class="rw-muted" role="status"></span>`;
    const names = ["Sam Rivera", "Jordan Ellis", "Taylor Chen"];
    let index = 0;
    root.querySelector("button").addEventListener("click", () => {
      const input = root.querySelector("input");
      input.value = names[index++ % names.length];
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      root.querySelector('[role="status"]').textContent = `Suggested name: ${input.value}`;
    });
    return root;
  },
};
