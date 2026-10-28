export interface PlotPoint {
  day: number;
  label: string;
  value: number | null;
  series: string;
}
export type PlotKind = "line" | "area" | "columns" | "stacked" | "horizontal" | "diverging";
export interface PlotOptions {
  points: readonly PlotPoint[];
  title: string;
  unit: string;
  kind?: PlotKind;
  height?: number;
  minimum?: number;
  maximum?: number;
  target?: number;
  compact?: boolean;
  grid?: boolean;
}
/** A gap ends the run. Zero and negative observations remain real observations. */
export function recordedRuns<T extends { value: number | null }>(points: readonly T[]) {
  const runs: (T & { value: number })[][] = [];
  let run: (T & { value: number })[] = [];
  for (const point of points) {
    if (point.value === null || !Number.isFinite(point.value)) {
      if (run.length) runs.push(run);
      run = [];
    } else run.push({ ...point, value: point.value });
  }
  if (run.length) runs.push(run);
  return runs;
}
export function samplePoints(kind: PlotKind, preset: string): PlotPoint[] {
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const values = [24, 38, 32, 61, 54, 82];
  const series = kind === "stacked" ? ["Scheduled", "Available"] : ["Output"];
  return series.flatMap((name, j) =>
    labels.map((label, i) => ({
      day: i + 1,
      label,
      series: name,
      value:
        preset === "zero"
          ? 0
          : preset === "missing" && i === 2
            ? null
            : kind === "diverging" && i % 2
              ? -values[i]
              : j
                ? [18, 22, 36, 24, 18, 10][i]
                : values[i],
    })),
  );
}
