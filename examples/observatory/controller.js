import { inspectorMarkup } from "./render.js";
/** Optional demo-only interactions. Native HTML/CSS owns every chart and popover. */
export function bindObservatory(root, data) {
  if (!data) return { destroy() {} };
  const abort = new AbortController(),
    signal = abort.signal;
  const dialog = root.querySelector("dialog");
  let selected = data.selected;
  root.addEventListener(
    "click",
    (event) => {
      const button = event.target.closest("button");
      if (!button || !root.contains(button)) return;
      if (button.hasAttribute("data-inspect")) {
        selected = Number(button.dataset.inspect);
        if (!Number.isInteger(selected) || !data.rows[selected]) return;
        root.querySelectorAll("[data-inspect]").forEach((b) => {
          b.setAttribute("aria-pressed", String(b === button));
        });
        root.querySelector("[data-inspector]").innerHTML = inspectorMarkup(data, selected);
        root.querySelector("[data-decision-resource]").textContent = data.rows[selected].name;
        root.querySelector("[data-plan-status]").textContent =
          `Review an illustrative upgrade for ${data.rows[selected].name}.`;
      }
      // Contemporary browsers use commandfor directly. Older engines only need this bridge.
      if (button.getAttribute("command") === "show-modal") {
        dialog.returnValue = "";
        if (!("commandForElement" in button) && !dialog.open) dialog.showModal();
      }
    },
    { signal },
  );
  dialog.addEventListener(
    "close",
    () => {
      if (dialog.returnValue === "pin")
        root.querySelector("[data-plan-status]").textContent =
          `Plan pinned for ${data.rows[selected].name}. No resources spent; this is a preview.`;
    },
    { signal },
  );
  return {
    destroy() {
      abort.abort();
      if (dialog.open) dialog.close();
      root.querySelectorAll("[popover]").forEach((p) => {
        if (p.matches(":popover-open")) p.hidePopover();
      });
    },
  };
}
