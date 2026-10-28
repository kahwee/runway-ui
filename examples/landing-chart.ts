import { mountExamplePlot } from "./charts/components.tsx";
const host = document.querySelector<HTMLElement>("#landing-chart");
if (host) {
  const chart = mountExamplePlot(host, {
    title: "Daily revenue",
    unit: "USD per day",
    kind: "columns",
    minimum: 0,
    maximum: 10000,
    points: [4200, 5800, 7600].map((value, i) => ({
      day: i + 1,
      label: ["Mon", "Tue", "Wed"][i],
      value,
      series: "Revenue",
    })),
  });
  addEventListener("pagehide", () => chart.destroy(), { once: true });
}
