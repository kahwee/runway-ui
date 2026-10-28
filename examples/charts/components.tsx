import { useMemo } from "react";
import { createRoot } from "react-dom/client";
import { areaY } from "@tanstack/charts/area";
import { barX, barY } from "@tanstack/charts/bar";
import { colorLegend } from "@tanstack/charts/legend";
import { lineY } from "@tanstack/charts/line";
import { ruleY } from "@tanstack/charts/rule";
import { stack } from "@tanstack/charts/stack";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { Chart, ChartCard, defineChart } from "../../react/index.ts";
import { recordedRuns, samplePoints, type PlotKind, type PlotOptions } from "./model.ts";

/** Shared example renderer. All quantitative geometry is owned by TanStack. */
export function ExamplePlot(options: PlotOptions) {
  const { points, kind = "line", title, unit, height = 200, compact = false } = options;
  const definition = useMemo(() => {
    const finite = points.filter((p) => p.value !== null && Number.isFinite(p.value));
    const categories = [...new Map(points.map((p) => [p.day, p.label])).entries()];
    const label = (day: number) => categories.find(([id]) => id === day)?.[1] ?? String(day);
    const series = [...new Set(points.map((p) => p.series))];
    const lines = series.flatMap((name) => recordedRuns(points.filter((p) => p.series === name)));
    const common = { x: "day" as const, y: "value" as const, color: "series" as const };
    const marks =
      kind === "horizontal"
        ? [barX(finite, { x: "value", y: "day", color: "series" })]
        : kind === "columns" || kind === "diverging" || kind === "stacked"
          ? [barY(finite, { ...common, ...(kind === "stacked" ? { layout: stack() } : {}) })]
          : lines.flatMap((run) =>
              kind === "area"
                ? [
                    areaY(run, { ...common, fillOpacity: 0.2 }),
                    lineY(run, { ...common, points: true }),
                  ]
                : [lineY(run, { ...common, points: true })],
            );
    if (options.target !== undefined && kind !== "horizontal")
      marks.push(ruleY([options.target], { y: (value) => value, strokeDasharray: "4 3" }));
    const valueScale = scaleLinear();
    if (options.minimum !== undefined && options.maximum !== undefined)
      valueScale.domain([options.minimum, options.maximum]);
    const valueAxis = compact ? (false as const) : { label: unit };
    const categoryAxis = compact
      ? false
      : {
          ticks: { values: categories.map(([id]) => id), format: label },
          tickLabels: { thin: { minGap: 8, priority: "ends" as const } },
        };
    return defineChart({
      marks,
      ...(series.length > 1 && !compact
        ? { color: { legend: colorLegend({ label: "Series" }) } }
        : {}),
      scales:
        kind === "horizontal"
          ? {
              x: { scale: valueScale, axis: valueAxis, grid: !compact && options.grid !== false },
              y: {
                scale: scaleBand<number>().domain(categories.map(([id]) => id)),
                axis: categoryAxis,
              },
            }
          : {
              x: {
                scale:
                  kind === "line" || kind === "area"
                    ? scaleLinear
                    : scaleBand<number>().domain(categories.map(([id]) => id)),
                axis: categoryAxis,
              },
              y: { scale: valueScale, axis: valueAxis, grid: !compact && options.grid !== false },
            },
      focus: "group-x",
      tooltip: {
        use: tooltip,
        items: [
          { field: "label", label: "Observation" },
          { field: "series", label: "Series" },
          { field: "value", label: unit },
        ],
      },
    });
  }, [points, kind, unit, compact, options.minimum, options.maximum, options.target, options.grid]);
  return points.some((p) => p.value !== null && Number.isFinite(p.value)) ? (
    <Chart
      definition={definition}
      height={height}
      ariaLabel={`${title} · ${unit}. Exact data follows.`}
    />
  ) : (
    <p>No observations recorded.</p>
  );
}

export interface ChartPlaygroundProps {
  kind: PlotKind;
  preset: string;
  width: number;
  height: number;
}
export function ChartPlayground({ kind, preset, width, height }: ChartPlaygroundProps) {
  const points = useMemo(() => samplePoints(kind, preset), [kind, preset]);
  return (
    <div style={{ maxInlineSize: width, minInlineSize: 0 }}>
      <ChartCard
        title="Monthly output"
        caption="Synthetic observations · units. TanStack owns every plotted mark; missing is not zero."
      >
        <ExamplePlot
          points={points}
          kind={kind}
          title="Monthly output"
          unit="units"
          height={height}
          minimum={kind === "diverging" ? -100 : 0}
          maximum={100}
        />
        <div className="rw-chart-data">
          <table>
            <caption>Exact observations · units</caption>
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">Series</th>
                <th scope="col">Units</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={`${p.series}-${p.day}`}>
                  <th scope="row">{p.label}</th>
                  <td>{p.series}</td>
                  <td>{p.value === null ? "Missing" : p.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}

export function mountExamplePlot(host: HTMLElement, options: PlotOptions) {
  const root = createRoot(host);
  root.render(<ExamplePlot {...options} />);
  return {
    update: (next: PlotOptions) => root.render(<ExamplePlot {...next} />),
    destroy: () => root.unmount(),
  };
}
export function mountChartPlayground(host: HTMLElement, options: ChartPlaygroundProps) {
  const root = createRoot(host);
  root.render(<ChartPlayground {...options} />);
  return {
    update: (next: ChartPlaygroundProps) => root.render(<ChartPlayground {...next} />),
    destroy: () => root.unmount(),
  };
}
