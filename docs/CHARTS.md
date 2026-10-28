# TanStack charts

Runway uses **TanStack Charts as its only plotting engine**. Import `Chart`,
`ChartCard` and `defineChart` from `@kahwee/runway-ui/react`; marks, scales and
transforms come from the pinned `@tanstack/charts` peer. Runway supplies theme,
figure and exact-table styling, not a second geometry engine.

[Open the chart lab](charts.html) · [Storybook playground](../storybook/?path=/story/charts-tanstack--columns)
· [Recorded-history recipe](../storybook/?path=/story/react-recorded-history--missing-day)

## React usage

```tsx
import { Chart, ChartCard, defineChart } from "@kahwee/runway-ui/react";
import { barY } from "@tanstack/charts/bar";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scaleBand } from "@tanstack/charts/scales/band";
import { useMemo } from "react";

const definition = useMemo(() => defineChart({
  marks: [barY(observations, { x: "day", y: "value" })],
  scales: { x: { scale: scaleBand }, y: { scale: scaleLinear, axis: { label: "Units per day" } } },
}), [observations]);

<ChartCard title="Recorded output" caption="Units per day · exact values follow">
  <Chart definition={definition} height={200} ariaLabel="Output by recorded day" />
  {/* Render an ordinary exact-data table from the same observations. */}
</ChartCard>;
```

The shared example renderer in `examples/charts/components.tsx` demonstrates
columns, stacked/signed/horizontal bars, lines, areas and small multiples.
It is example code, not an additional public component API. Standalone example
pages bundle React/TanStack locally at publication time; no CDN or import map is
required. The adjacent license file retains third-party notices.

## Honest data and accessibility

- Keep original values, units and category/time identity. Never normalize stacks
  to percentages unless that is explicitly the intended measure.
- Zero and negative numbers are valid observations. Missing/nonfinite values end
  a line/area run; never substitute zero or connect across a gap. Bar categories
  retain their original positions when a value is missing.
- Observed and projected values are separate series, explicitly named in the
  tooltip and exact table. Forecasts are assumptions, not recorded outcomes.
- Use a caption, accessible chart name and exact-data table. TanStack owns focus,
  tooltips, legends, collision-aware tick labels, axes and plot geometry; do not patch its internal SVG or recreate
  keyboard interaction. Keep tables readable when scripts fail.
- Memoize definitions. Application-owned mounts must update or unmount their
  React roots, and avoid stealing focus/scroll during ordinary refreshes.
- Preserve reduced motion and readable forced-color data. Chromium viewport
  checks are not physical-touch, Safari or screen-reader certification.

## Migration from CSS plots

The CSS-only column, stacked/diverging bar, six-point area, sparkline and legacy
history geometry implementations are removed from current source. The original
`rw-column-*`, `rw-stack-mark`, `rw-diverging-*`, `rw-area`, `rw-spark` and
`rw-chart__plot` marks no longer draw anything. Move their original observations
to TanStack marks and retain labels/units/notes in the exact table.

`charts.css` remains a stable styling entry for figure/table layout only;
`history.css` retains history-surface and screen-reader utilities. Importing CSS
alone does not create a chart. Native progress and meters remain bounded-state
controls, not alternative time-series renderers. See the [React guide](REACT.md).
