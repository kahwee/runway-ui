import { mountExamplePlot } from "../charts/components.tsx";
import { inspectorMarkup } from "./render.ts";
/** Demo-only lifecycle. TanStack owns plots; the browser owns native dialogs/popovers. */
export function bindObservatory(root, data) {
  if (!data) return { destroy() {} };
  const plots = [...root.querySelectorAll("[data-trend-chart]")].map((host, index) => {
    const metric = data.metrics[index];
    return mountExamplePlot(host, {
      title: metric.name,
      unit: metric.unit,
      height: 64,
      compact: true,
      minimum: 0,
      maximum: metric.max,
      points: metric.values.map((value, i) => ({
        day: i + 1,
        label: `Cycle ${i + 1}`,
        value,
        series: "Observed",
      })),
    });
  });
  plots.push(
    mountExamplePlot(root.querySelector("[data-history-chart]"), {
      title: "Output history",
      grid: data.a.grid,
      unit: data.a.unit,
      height: data.a.plotHeight,
      minimum: 0,
      maximum: data.a.maximum,
      target: data.a.target,
      points: data.values.map((value, i) => ({
        day: i + 1,
        label: data.labels[i],
        value,
        series: i > data.lastObserved ? "Projected" : "Observed",
      })),
    }),
  );
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
      plots.forEach((plot) => plot.destroy());
      abort.abort();
      if (dialog.open) dialog.close();
      root.querySelectorAll("[popover]").forEach((p) => {
        if (p.matches(":popover-open")) p.hidePopover();
      });
    },
  };
}
