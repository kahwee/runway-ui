import { useMemo } from "react";
import { ChartCard, Runway } from "../../react/index.ts";
import { ExamplePlot } from "../../examples/charts/components.tsx";
export { recordedRuns } from "../../examples/charts/model.ts";

export interface RecordedPoint {
  day: number;
  value: number | null;
}
export interface RecordedHistoryProps {
  preset: "gaps" | "zero" | "signed" | "empty";
  width: number;
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
  const plotPoints = useMemo(
    () => points.map((p) => ({ ...p, label: `Day ${p.day}`, series: "Net output" })),
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
            <ExamplePlot points={plotPoints} title="Recorded net output" unit="units per day" />
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
