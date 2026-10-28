import { useMemo } from "react";
import { lineY } from "@tanstack/charts/line";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { Chart, ChartCard, defineChart, Runway } from "../../react/index.ts";

export interface RecordedPoint {
  day: number;
  value: number | null;
}
export interface RecordedHistoryProps {
  preset: "gaps" | "zero" | "signed" | "empty";
  width: number;
}

/** Example adapter: a missing observation ends a line; it is never a zero. */
export function recordedRuns(points: readonly RecordedPoint[]) {
  const runs: { day: number; value: number }[][] = [];
  let run: { day: number; value: number }[] = [];
  for (const point of points) {
    if (point.value === null || !Number.isFinite(point.value)) {
      if (run.length) runs.push(run);
      run = [];
    } else run.push({ day: point.day, value: point.value });
  }
  if (run.length) runs.push(run);
  return runs;
}

const samples: Record<RecordedHistoryProps["preset"], readonly RecordedPoint[]> = {
  gaps: [
    { day: 1, value: 8 },
    { day: 2, value: 12 },
    { day: 3, value: null },
    { day: 4, value: 0 },
    { day: 5, value: 9 },
  ],
  zero: [
    { day: 1, value: 0 },
    { day: 2, value: 0 },
  ],
  signed: [
    { day: 1, value: -8 },
    { day: 2, value: 0 },
    { day: 3, value: 12 },
  ],
  empty: [],
};

/** Generic recorded-data recipe; no game simulation or persistence belongs here. */
export function RecordedHistory({ preset, width }: RecordedHistoryProps) {
  const points = samples[preset];
  const definition = useMemo(
    () =>
      defineChart({
        marks: recordedRuns(points).map((run) =>
          lineY(run, { x: "day", y: "value", points: true }),
        ),
        scales: {
          x: {
            scale: scaleLinear,
            axis: {
              label: "Recorded day",
              ticks: { values: points.map((p) => p.day), format: (day: number) => `Day ${day}` },
            },
          },
          y: { scale: scaleLinear, nice: true, grid: true, axis: { label: "Units per day" } },
        },
        focus: "group-x",
        tooltip: {
          use: tooltip,
          items: [
            { field: "day", label: "Recorded day" },
            { field: "value", label: "Units per day" },
          ],
        },
      }),
    [points],
  );
  return (
    <Runway>
      <div style={{ maxInlineSize: width, minInlineSize: 0 }}>
        <ChartCard
          title="Recorded net output"
          caption="Synthetic observations · units per day. Missing means unrecorded, not zero. Use arrow keys on the chart; exact values follow."
        >
          {points.length ? (
            <Chart
              definition={definition}
              height={200}
              ariaLabel="Recorded net output in units per day. Exact observations follow."
            />
          ) : (
            <p>No observations recorded.</p>
          )}
          <div className="rw-chart-data" style={{ fontSize: "inherit" }}>
            <table>
              <caption>Exact recorded observations · units per day</caption>
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Units per day</th>
                </tr>
              </thead>
              <tbody>
                {points.map((point) => (
                  <tr key={point.day}>
                    <th scope="row">Day {point.day}</th>
                    <td>{point.value === null ? "Not recorded" : point.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </Runway>
  );
}
