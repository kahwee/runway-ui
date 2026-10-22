# Modern CSS is the baseline

Runway UI targets contemporary desktop engines with native CSS nesting, subgrid, cascade layers, container size queries, logical properties and perceptual color mixing. There is no legacy float layout, clearfix, preprocessor mixin or JavaScript equal-height workaround. Basic grid, flex and block layout remain useful for their normal jobs.

## Shared parent tracks

| Component | Shared tracks | Content contract |
| --- | --- | --- |
| `g-form-grid > g-field` | Three row tracks | Associated label, control, optional hint |
| `g-card-grid > g-card` | Four row tracks | `g-card__title`, `g-card__description`, `g-card__body`, `g-card__footer` |
| `g-stat-grid > g-stat` | Three row tracks | `g-stat__label`, `g-stat__value`, `g-stat__detail` |
| `g-choice-list > g-choice` | Description and cost columns | Two children per choice |
| `g-objectives > li` | Status and description columns | Existing two-child markup |
| `g-series-list > li` | Label, plot, number columns | Existing three-child chart markup |
| `g-ledger > g-ledger__row` | Production columns | Existing ledger markup |
| `g-columns > li` | Plot, value, category rows | Existing column chart markup |

These are real subgrids, not copies of the same track definition on each child. Card and field groups auto-place into the next group of shared rows. Keep the documented slots when a section is absent; an empty optional slot can be omitted when the remaining slot classes have explicit positions. Form fields use their first three direct children; do not wrap the control inside the label in this pattern. Native label associations remain intact. Do not put size containment on an individual row-subgrid card: it defeats content-based parent row sizing.

```html
<div class="g-layout">
  <form class="g-form-grid">
    <div class="g-field">
      <label for="department">Department</label>
      <select class="g-input" id="department"><option>Research</option></select>
      <small>The hint has its own shared row.</small>
    </div>
    <div class="g-field">
      <label for="lead">The person with the excellent clipboard</label>
      <input class="g-input" id="lead">
      <small>Longer labels keep neighboring controls aligned.</small>
    </div>
  </form>
</div>
```

Use `g-layout` for a named inline-size container. Preferred columns come from `--g-form-columns` (2), `--g-card-columns` (3) and `--g-stat-columns` (4). Below 720px of container space, cards/stat tiles are capped at two columns; below 460px, cards/forms/stats are capped at one. A preferred one-column layout stays one column at every width. These adapt a component inside a desktop panel, independently of the browser viewport. Fluid titles use `cqi`, `clamp()` and `text-wrap:balance`; descriptions use `text-wrap:pretty`.

Internal row spacing uses `--g-content-gap` (10px, compact 8px), independently of the 14px/10px group gap `--g-space`. A chart figure containing a direct `g-series-list` shares intrinsic label, plot and value columns through two levels of subgrid. Its adjacent scale occupies the actual plot column; no label-width offsets are needed. Long labels and values wrap within bounded tracks. Keep the scale immediately after the list.

## Newer capabilities with deliberate degradation

- **Native CSS nesting** groups each layout's direct-child slot rules.
- **OKLCH color mixing** derives surfaces, borders and highlights perceptually across themes.
- **Typed `@property --g-value`** registers percentages for meter interpolation. Keep existing values as percentages; a parent may supply the value because it inherits.
- **`::details-content` + `interpolate-size:allow-keywords`** animates native disclosure height without measurement JavaScript. Unsupported engines keep ordinary native details behavior; motion preferences disable the transition.
- **`appearance:base-select` / `::picker(select)`** remains an opt-in native picker enhancement.
- **Typed `attr()` and `shape()`** enhance numeric charts and CSS area paths; the existing custom-property and polygon paths stay functional where those newer APIs are absent.
- **`@starting-style` and discrete `display`/`overlay` transitions** animate the native dialog's top-layer lifecycle.
- **`:has()`** handles selected choices and field focus/validation without mirror state classes.

Feature support is checked for the capability being enhanced. No new layout runtime, polyfill or browser-sniffing script is introduced. Forced-color and reduced-motion accommodations remain. These are capability choices, not a claim that every engine or assistive technology has been directly verified.

[Shared-track example](../examples/layouts.html) · [Storybook layout playground](../storybook/?path=/story/foundations-subgrid-layouts--playground)

Primary references: [MDN subgrid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid), [container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries), [interpolate-size](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/interpolate-size), [details content](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::details-content).
