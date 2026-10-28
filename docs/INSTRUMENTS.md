# History instruments & Play material

`rw-instrument` is a tactile frame with enamel surfaces, inset numeric readouts
and decorative CSS rivets. `rw-console` contains an adaptive instrument grid.
These are presentation surfaces; they do not compute or draw chart geometry.

Set `data-skin="play"` on a `rw-ui` root for deeper panel edges, raised primary
controls and instrument-like tiles. Classic styling remains available by omitting
it. Dialog roots should receive the same skin/theme attributes. Native button
and dialog behavior remain intact.

## History charts

Use TanStack through React `Chart` and `ChartCard` for every history, including
small multiples. The old CSS signed bars, custom SVG line history and CSS
window overview are removed. Do not recreate their geometry in host styles.
Keep original observations and annotations in exact tables. See [charts](CHARTS.md).

## Other instruments

The impact subgrid, numeric readouts and native bounded meters remain available.
Container queries, subgrid, logical properties and OKLCH mixing are the styling
baseline. Forced colors remove decorative rivets and preserve readable data.
Event notes in the [Observatory](OBSERVATORY.md) use native popovers; unsupported
popover engines can still read the same note in the exact-data disclosure.
