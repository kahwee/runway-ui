import { mountChartPlayground } from "../examples/charts/components.tsx";
import type { PlotKind } from "../examples/charts/model.ts";

const form = document.querySelector<HTMLFormElement>("#chart-options")!;
const host = document.querySelector<HTMLElement>("#chart-playground")!;
const kind = document.querySelector<HTMLSelectElement>("#chart-kind")!;
const preset = document.querySelector<HTMLSelectElement>("#chart-data")!;
const theme = document.querySelector<HTMLSelectElement>("#chart-theme")!;
const options = () => ({
  kind: kind.value as PlotKind,
  preset: preset.value,
  width: 900,
  height: 240,
});
const chart = mountChartPlayground(host, options());
form.addEventListener("change", () => {
  document.body.dataset.theme = theme.value;
  chart.update(options());
});
form.addEventListener("submit", (event) => event.preventDefault());
addEventListener("pagehide", () => chart.destroy(), { once: true });
