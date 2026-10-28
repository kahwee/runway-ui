# History instruments & Play material


`rw-instrument` is a tactile frame with enamel surfaces, inset numeric readouts and decorative CSS rivets. `rw-console` contains a two-column instrument grid which adapts to its named desktop panel container. No image, layout measurement or runtime dependency is required.

Set `data-skin="play"` on a `rw-ui` root for deeper panel edges, raised primary controls, stronger badges and instrument-like trend tiles. Classic styling remains available by omitting it or choosing Classic in Storybook. Dialog roots should receive the same skin/theme attributes. The optional skin changes appearance; native button and dialog behavior remain intact.

## History charts

History renderers and the windowed timeline were removed. Draw time series with `@tanstack/charts` through the React `Chart` and `ChartCard` components; the history and instrument CSS remains for existing markup.

## Modern CSS and degradation

Signed geometry uses CSS arithmetic and custom properties. Typed numeric `attr()` with `abs()` enhances mark inputs; the renderer also supplies absolute custom-property values. Native CSS nesting, container queries, subgrid, logical properties and OKLCH mixing remain the baseline. Event notes reuse the native top layer, implicit anchors, named position-try fallbacks and reduced-motion transitions documented in [Observatory](OBSERVATORY.md). Forced colors retain explicit signs, values and readable marks; decorative rivets disappear.

Read [status](STATUS.md) for the focused browser observations. This is not a general-purpose chart engine: no free-form zoom/brush, irregular-time interpolation or causal inference is provided.

Windowed history validates the complete series before mounting, including offscreen values and annotation indexes. Start indexes must be non-negative integers, window sizes 1–366 and overview bins positive integers. Empty series show “No observations” with disabled navigation and finite geometry. `setWindow()` cannot redraw a destroyed view.
