# Modern CSS is the baseline

Runway UI targets contemporary desktop engines with native CSS nesting, subgrid, cascade layers, container size queries, logical properties and perceptual color mixing. There is no legacy float layout, clearfix, preprocessor mixin or JavaScript equal-height workaround. Basic grid, flex and block layout remain useful for their normal jobs.

## Shared parent tracks

| Component | Shared tracks | Content contract |
| --- | --- | --- |
| `rw-form-grid > rw-field` | Three row tracks | Associated label, control, optional hint |
| `rw-card-grid > rw-card` | Four row tracks | `rw-card__title`, `rw-card__description`, `rw-card__body`, `rw-card__footer` |
| `rw-stat-grid > rw-stat` | Three row tracks | `rw-stat__label`, `rw-stat__value`, `rw-stat__detail` |
| `rw-choice-list > rw-choice` | Description and cost columns | Two children per choice |
| `rw-objectives > li` | Status and description columns | Existing two-child markup |
| `rw-series-list > li` | Label, plot, number columns | Existing three-child chart markup |
| `rw-ledger > rw-ledger__row` | Production columns | Existing ledger markup |
| `rw-columns > li` | Plot, value, category rows | Existing column chart markup |

These are real subgrids, not copies of the same track definition on each child. Card and field groups auto-place into the next group of shared rows. Keep the documented slots when a section is absent; an empty optional slot can be omitted when the remaining slot classes have explicit positions. Form fields use their first three direct children; do not wrap the control inside the label in this pattern. Native label associations remain intact. Do not put size containment on an individual row-subgrid card: it defeats content-based parent row sizing.

```html
<div class="rw-layout">
  <form class="rw-form-grid">
    <div class="rw-field">
      <label for="department">Department</label>
      <select class="rw-input" id="department"><option>Research</option></select>
      <small>The hint has its own shared row.</small>
    </div>
    <div class="rw-field">
      <label for="lead">The person with the excellent clipboard</label>
      <input class="rw-input" id="lead">
      <small>Longer labels keep neighboring controls aligned.</small>
    </div>
  </form>
</div>
```

Use `rw-layout` for a named inline-size container. Preferred columns come from `--rw-form-columns` (2), `--rw-card-columns` (3) and `--rw-stat-columns` (4). Below 720px of container space, cards/stat tiles are capped at two columns; below 460px, cards/forms/stats are capped at one. A preferred one-column layout stays one column at every width. These adapt a component inside a desktop panel, independently of the browser viewport. Fluid titles use `cqi`, `clamp()` and `text-wrap:balance`; descriptions use `text-wrap:pretty`.

Internal row spacing uses `--rw-content-gap` (10px, compact 8px), independently of the 14px/10px group gap `--rw-space`. A chart figure containing a direct `rw-series-list` shares intrinsic label, plot and value columns through two levels of subgrid. Its adjacent scale occupies the actual plot column; no label-width offsets are needed. Long labels and values wrap within bounded tracks. Keep the scale immediately after the list.

## Signed instruments

[History instruments](INSTRUMENTS.md) add signed zero-baseline CSS geometry, typed numeric attributes with absolute-value enhancement, reusable four-column impact subgrids and a tactile Play material. Host custom properties remain the numeric fallback.

## Observatory composition

The [Simulation Observatory](OBSERVATORY.md) adds native event popovers with implicit CSS anchors and position fallback, an opt-in named scroll timeline for ledger progress, and declarative native dialog commands with a small optional bridge for engines without command support. Its shared-row metric cards and shared-column ledger extend the subgrid baseline. Read its contract for exact degradation and data semantics.

## Newer capabilities with deliberate degradation

- **Native CSS nesting** groups each layout's direct-child slot rules.
- **OKLCH color mixing** derives surfaces, borders and highlights perceptually across themes.
- **Typed `@property --rw-value`** registers percentages for meter interpolation. Keep existing values as percentages; a parent may supply the value because it inherits.
- **`::details-content` + `interpolate-size:allow-keywords`** animates native disclosure height without measurement JavaScript. Unsupported engines keep ordinary native details behavior; motion preferences disable the transition.
- **`appearance:base-select` / `::picker(select)`** remains an opt-in native picker enhancement.
- **Typed `attr()` and `shape()`** enhance numeric charts and CSS area paths; the existing custom-property and polygon paths stay functional where those newer APIs are absent.
- **`@starting-style` and discrete `display`/`overlay` transitions** animate the native dialog's top-layer lifecycle.
- **`:has()`** handles selected choices and field focus/validation without mirror state classes.

Feature support is checked for the capability being enhanced. No new layout runtime, polyfill or browser-sniffing script is introduced. Forced-color and reduced-motion accommodations remain. These are capability choices, not a claim that every engine or assistive technology has been directly verified.

[Shared-track example](../examples/layouts.html) · [Storybook layout playground](../storybook/?path=/story/foundations-subgrid-layouts--playground)

Primary references: [MDN subgrid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid), [container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries), [interpolate-size](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/interpolate-size), [details content](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::details-content).

## Dialog and select enhancements

- **Dialog** uses `@starting-style` with `allow-discrete` transitions for `display` and `overlay`, so the dialog and its `::backdrop` fade and spring in from the top layer. Browsers without these features open and close it instantly.
- **Customizable select** (`data-picker="enhanced"`) uses `appearance:base-select`, an anchored `::picker(select)` sized with `anchor-size()`, a styled `option::checkmark` and an entry animation. Unsupported browsers keep the padded native select. The picker has no exit animation because minifiers reject state pseudo-classes after `::picker()`.

### Playful customizable select

With `data-picker="enhanced"`, a `<button><selectedcontent></selectedcontent></button>` first child and rich `<option>` content, the picker gets:

| Feature | CSS | Without it |
| --- | --- | --- |
| Rich options and closed-state mirror | `appearance:base-select`, `selectedcontent` | Native select shows plain option text |
| Spring check badge | `option::checkmark` + `@starting-style` | Native selection indicator |
| Staggered entry | `transition-delay` from `sibling-index()` | Options appear together |
| Colour dots from data | typed `attr(data-color type(<color>))` | No dot; option still works |
| Bouncy arrow, hover boop | `::picker-icon`, keyframes | Static |

Currently Chrome 135+ for base-select (`sibling-index()` and typed `attr()` arrive later in some engines). Every layer is behind `@supports`, motion is off under `prefers-reduced-motion`, and the same markup stays a working native select elsewhere. Keep the description inside a `small` so the closed state can hide it.
