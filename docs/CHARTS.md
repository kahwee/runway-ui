# CSS charts

[Open the chart lab](charts.html). All plots use original HTML/CSS, with no SVG, canvas or chart dependency. The lab's JavaScript only changes data, options and copyable markup; it does not calculate pixel geometry.

## Load

Use `index.css` or `dist/runway-ui.css` for the full library. For selective loading, import `styles/tokens.css` and `styles/charts.css`, with a `rw-ui` ancestor supplying tokens. The package alias `runway-ui/charts.css` exports the chart module. This local iteration is not published to npm.

## Common contract

Wrap a plot in `figure.rw-figure`, include a `figcaption` with units and scale, and supply exact values in HTML. `--rw-chart-max` defaults to 100 and MUST be finite and greater than zero. `--rw-chart-height` defaults to 180px. `--rw-chart-color` defaults to the theme accent. `data-grid="off"` removes the background grid.

The application owns aggregation, sorting, missing data, validation and scaling. Do not silently encode missing observations as zero. CSS clips out-of-range marks to the plot bounds; it cannot report invalid business data. Validate values before rendering and display a warning if clipping is intentional. Keep the scale fixed when comparing datasets.

| Plot | Markup | Numeric input | Valid domain |
|---|---|---|---|
| Column | `ol.rw-columns > li`, `.rw-column-track > .rw-column-mark`, real value and category siblings | `--rw-amount`, optionally `data-value` on each mark | 0 through maximum |
| Stacked horizontal | `.rw-series-list`, `.rw-stack-track > .rw-stack-mark` | Amount per segment, shared maximum | Each segment >=0; sum <= maximum |
| Diverging horizontal | `.rw-series-list`, `.rw-diverging-track > .rw-diverging-mark` | Signed amount; negative marks require `data-negative` | −maximum through +maximum; symmetric zero axis |
| Area | `.rw-area` | Six `--rw-y0` through `--rw-y5` percentage coordinates | 0% top, 100% bottom; six equally spaced observations |
| Legacy horizontal | `table.rw-chart`, `.rw-chart__plot` | `--rw-value:40%` | 0% through 100%; existing API preserved |

### Column recipe

```html
<figure class="rw-figure" style="--rw-chart-max:100">
  <figcaption>Monthly output <small>Units · 0–100</small></figcaption>
  <ol class="rw-columns" role="list">
    <li>
      <span class="rw-column-track">
        <i class="rw-column-mark" data-value="42"
           style="--rw-amount:42" aria-hidden="true"></i>
      </span>
      <strong>42</strong><span class="rw-category">January</span>
    </li>
  </ol>
</figure>
```

For typed `attr()` browsers, `data-value` supplies the numeric input. Elsewhere, `--rw-amount` supplies it. If both are present, keep them equal. Visible text is separate: CSS cannot ensure that the label agrees with the geometry. Render all three from the same application value. With only the fallback custom property, the chart works without typed attributes.

### Stacks and diverging bars

Stack segments share a fixed absolute scale; they are not automatically normalized to 100%. Label each series in a legend and provide segment values in an exact-data table. Color alone must not carry meaning. Diverging bars always place zero in the center. Mark negative values with `data-negative`; positive marks omit it. Use signed text values and visible −maximum / 0 / +maximum labels.

### Area geometry

The area chart is a bounded six-point primitive, not an arbitrary-length time-series engine. For a value of 24 on a 0–100 scale, supply `--rw-y0:76%`. The host computes percentage coordinates from validated data. Set all six coordinates explicitly. Positions are equally spaced, with straight interpolation and a zero baseline. Do not use it for irregular timestamps without resampling and explaining that transformation. Exact observations belong in a table. No smoothing is applied, so curves do not invent intermediate peaks.

## Modern CSS and fallbacks

| Feature | Purpose | Fallback |
|---|---|---|
| Cascade layers | Predictable host overrides | Modern browser required by library |
| Subgrid | Columns share plot, value and label tracks | Modern browser required; do not promise legacy layout |
| Container queries | Compact labels and row tracks inside narrow panels | Default spacious chart layout |
| Typed `attr()` | Read numeric HTML attributes directly | Inline `--rw-amount` |
| `shape()` | Responsive area path with percentage coordinates | Equivalent `polygon()` path |
| `color-mix(in oklch,…)` | Theme-derived area fill | Modern browser required |
| Logical properties | Inline and block sizing | Modern browser required |
| Forced colors | Preserve solid marks and explicit zero axis | Labels and exact-data tables remain available |

References: [MDN typed attr()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/attr), [MDN shape()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/basic-shape/shape). Feature detection in the lab reports the current browser, not a cross-browser support guarantee. New features are used where they improve the implementation; experimental syntax is not a requirement for seeing the data.

## Accessibility and limits

Keep a descriptive caption, units, scale, text values and a native `details` disclosure containing an ordinary data table. Decorative marks are hidden from accessibility APIs. The column list preserves labels and values without JavaScript. Stacked segment values remain in the exact-data table. There is no hover-only tooltip or animation requirement.

Charts do not provide zoom, brush selection, interactive crosshairs, automatic ticks, arbitrary line paths or thousands of points. Use an appropriate plotting engine for those needs. This module is intended for small, readable simulation panels. Focused desktop Chromium checks do not establish screen-reader conformance or cross-browser certification.
