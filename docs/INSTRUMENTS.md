# History instruments & Play material

[Open the history instrument playground](../storybook/?path=/story/charts-history-instruments--playground).

`rw-instrument` is a tactile frame with enamel surfaces, inset numeric readouts and decorative CSS rivets. `rw-console` contains a two-column instrument grid which adapts to its named desktop panel container. No image, layout measurement or runtime dependency is required.

Set `data-skin="play"` on a `rw-ui` root for deeper panel edges, raised primary controls, stronger badges and instrument-like trend tiles. Classic styling remains available by omitting it or choosing Classic in Storybook. Dialog roots should receive the same skin/theme attributes. The optional skin changes appearance; native button and dialog behavior remain intact.

## Shared history renderer

```js
import { renderHistory } from 'runway-ui/history';
container.innerHTML = renderHistory({
  title: 'Supply balance', unit: 'units / cycle',
  values: [12, 24, null, -18, 30, 42],
  labels: ['01', '02', '03', '04', '05', '06'],
  minimum: -100, maximum: 100,
  annotations: [{ index: 3, title: 'A recorded decision',
    description: 'A change was observed here; this is not causal attribution.' }],
});
```

This optional ES module returns escaped semantic HTML. It performs validation and prepares CSS inputs, never drawing or measuring chart geometry. The full stylesheet includes the necessary modules; selective consumers need tokens, primitives, charts, history, observatory (native context popovers) and instruments. `runway-ui/instruments.css` is a style-only alias. It does not pull prerequisites in automatically. No event controller is needed for the chart, disclosures or native popovers.

- Accepts zero to 366 observations, one label per value, finite signed in-scale numbers and explicit `null` gaps. An empty series shows an empty state. Supply equally spaced observations; insert nulls for absent slots rather than compressing time.
- A finite declared minimum/maximum must span zero and have positive range. Inputs outside it are rejected, never silently clipped. The host owns scale selection, missing-data meaning and any aggregation.
- `format` supplies the current/visible value labels; `axisFormat` supplies axis labels; `exactFormat` supplies the native exact-data table. Each numeric table cell also retains its raw value in a native `data[value]` element. Formatters must not imply precision absent from the source.
- `detail: 'auto'` switches to compact labels above 18 points. Use `compact` explicitly for long formatted values; it retains first/middle/last category labels and the complete table. There is no downsampling.
- Annotation indexes refer to real observation slots. Multiple notes in a slot share one native button/popover and remain individually available in the exact table. All note strings are escaped. No hover-only interaction.
- Negative marks extend below the actual zero line. The host defines whether negative is good, bad or neutral. Override `--rw-chart-color` and `--rw-negative-color` to express that meaning; never rely on color without signed labels and context.
- `rw-impact` and `rw-impact__row` share four column tracks with subgrid for signal/before/after/change comparisons. The host supplies all values and interpretation. The library includes no finance, staffing, simulation or attribution rules.

## Long time series: windowed history

The direct renderer accepts up to 366 observations and thins axis labels for dense windows. For daily or longer time series use the optional `mountHistoryWindow` behavior:

```js
import { mountHistoryWindow } from 'runway-ui/timeseries';
const view = mountHistoryWindow(element, { values, labels, minimum: -100, maximum: 100, windowSize: 30 });
// later
view.destroy();
```

- The host keeps every observation; only one window (default 30, up to 366 observations) is rendered as real columns. Nothing in the window is downsampled, and the exact table covers that window.
- A whole-series overview shows up to 120 bars, each the mean of the real observations it covers, with an all-missing bin left empty. It is labelled as an overview. A native `input[type=range]` scrubs the window start; the buttons page by one window, and a native select changes the window (week, fortnight, month, quarter).
- Annotations use full-series indexes and appear when their observation is in the window. `destroy()` aborts all listeners and empties the root.
- The playground offers up to 5,000 synthetic daily observations. This is a demonstration size, not a performance guarantee.

## Modern CSS and degradation

Signed geometry uses CSS arithmetic and custom properties. Typed numeric `attr()` with `abs()` enhances mark inputs; the renderer also supplies absolute custom-property values. Native CSS nesting, container queries, subgrid, logical properties and OKLCH mixing remain the baseline. Event notes reuse the native top layer, implicit anchors, named position-try fallbacks and reduced-motion transitions documented in [Observatory](OBSERVATORY.md). Forced colors retain explicit signs, values and readable marks; decorative rivets disappear.

Read [status](STATUS.md) for the focused browser observations. This is not a general-purpose chart engine: no free-form zoom/brush, irregular-time interpolation or causal inference is provided.
