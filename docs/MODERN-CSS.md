# Modern CSS is the baseline

Runway UI targets contemporary desktop engines with native CSS nesting, subgrid, cascade layers, container size queries, logical properties and perceptual color mixing. There is no legacy float layout, clearfix, preprocessor mixin or JavaScript equal-height workaround. Basic grid, flex and block layout remain useful for their normal jobs.

## Shared parent tracks

| Component                    | Shared tracks                  | Content contract                                                             |
| ---------------------------- | ------------------------------ | ---------------------------------------------------------------------------- |
| `rw-form-grid > rw-field`    | Three row tracks               | Associated label, control, optional hint                                     |
| `rw-card-grid > rw-card`     | Four row tracks                | `rw-card__title`, `rw-card__description`, `rw-card__body`, `rw-card__footer` |
| `rw-stat-grid > rw-stat`     | Three row tracks               | `rw-stat__label`, `rw-stat__value`, `rw-stat__detail`                        |
| `rw-choice-list > rw-choice` | Description and cost columns   | Two children per choice                                                      |
| `rw-objectives > li`         | Status and description columns | Existing two-child markup                                                    |
| `rw-series-list > li`        | Label, plot, number columns    | Existing three-child chart markup                                            |
| `rw-ledger > rw-ledger__row` | Production columns             | Existing ledger markup                                                       |
| `rw-columns > li`            | Plot, value, category rows     | Existing column chart markup                                                 |

These are real subgrids, not copies of the same track definition on each child. Card and field groups auto-place into the next group of shared rows. Keep the documented slots when a section is absent; an empty optional slot can be omitted when the remaining slot classes have explicit positions. Form fields use their first three direct children; do not wrap the control inside the label in this pattern. Native label associations remain intact. Do not put size containment on an individual row-subgrid card: it defeats content-based parent row sizing.

```html
<div class="rw-layout">
  <form class="rw-form-grid">
    <div class="rw-field">
      <label for="department">Department</label>
      <select class="rw-input" id="department">
        <option>Research</option>
      </select>
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
- **`appearance:base-select` / `::picker(select)`** is the default picker wherever supported; `data-picker="native"` opts out and other engines keep the padded native select.
- **Typed `attr()` and `shape()`** enhance numeric charts and CSS area paths; the existing custom-property and polygon paths stay functional where those newer APIs are absent.
- **`@starting-style` and discrete `display`/`overlay` transitions** animate the native dialog's top-layer lifecycle.
- **`:has()`** handles selected choices and field focus/validation without mirror state classes.

Feature support is checked for the capability being enhanced. No new layout runtime, polyfill or browser-sniffing script is introduced. Forced-color and reduced-motion accommodations remain. These are capability choices, not a claim that every engine or assistive technology has been directly verified.

[Shared-track example](../examples/layouts.html) · [Storybook layout playground](../storybook/?path=/story/foundations-subgrid-layouts--playground)

Primary references: [MDN subgrid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid), [container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries), [interpolate-size](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/interpolate-size), [details content](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::details-content).

## Dialog and select enhancements

- **Dialog** uses `@starting-style` with `allow-discrete` transitions for `display` and `overlay`, so the dialog and its `::backdrop` fade and spring in from the top layer. Browsers without these features open and close it instantly.
- **Customizable select** (default; `data-picker="native"` opts out) uses `appearance:base-select`, an anchored `::picker(select)` sized with `anchor-size()`, a styled `option::checkmark` and an entry animation. Unsupported browsers keep the padded native select. The picker has no exit animation because minifiers reject state pseudo-classes after `::picker()`.

### Playful customizable select

By default, with a `<button><selectedcontent></selectedcontent></button>` first child and rich `<option>` content, the picker gets:

| Feature                              | CSS                                         | Without it                            |
| ------------------------------------ | ------------------------------------------- | ------------------------------------- |
| Rich options and closed-state mirror | `appearance:base-select`, `selectedcontent` | Native select shows plain option text |
| Selection checkmark                  | `option::checkmark`                         | Native selection indicator            |
| Stable option layout                 | Native option flow                          | Native option flow                    |
| Colour dots from data                | typed `attr(data-color type(<color>))`      | No dot; option still works            |
| Rotating CSS caret                   | `::picker-icon`                             | Padded native dropdown                |

Detect each capability rather than assuming a browser version provides the whole recipe. Every layer is behind `@supports`, motion is off under `prefers-reduced-motion`, and the same markup stays a working native select elsewhere. Keep the description inside a `small` so the closed state can hide it.

## Form enhancements

`field-sizing:content` lets textareas grow intrinsically; engines without it retain ordinary resizable textareas and their minimum size. Native range controls work without the optional output/fill binding. Switches and option cards retain native checked, focus and disabled semantics; forced-color styles expose system colors. Reduced-motion rules disable decorative spring and picker animations. See [fields](FIELDS.md) for markup.

## Illustrated navigation

The illustrated workspace navigation uses ordinary flex layout with intrinsic labels, logical sizing and native links/buttons. It introduces no new browser capability. Reduced motion disables hover translation/rotation, and forced colors preserve an explicit selected border and underline. See [the markup contract](COMPONENTS.md#illustrated-workspace-navigation).

### Native select refinement

Every `select.rw-input` and `.rw-native select` uses `appearance: base-select` when supported, including the native `::picker(select)`, `::picker-icon` and option `::checkmark`. Plain text and rich options share readable spacing, wrapping, disabled states and keyboard focus; options do not move or stagger while navigating. Checkmarks and the CSS caret do not require the icon bundle. The picker is viewport-bounded and scrollable, with anchor sizing where supported. Native selection, form submission, typeahead, Escape and focus remain browser-owned; there is no replacement listbox or picker JavaScript.

`data-picker="native"` opts out. Unsupported browsers retain a native dropdown with an arrow gutter. `multiple` and `size` greater than one retain native list selection and are excluded from customizable-picker recipes. Rich option content and selectedcontent require supporting browsers; plain-text option labels remain the portable baseline. Reduced motion removes caret transitions; forced colors preserve native system colors and selection contrast. Use `examples/studio.html` to inspect plain, grouped, disabled, long-label, fallback and list variants together.

### Paper workspace and pacing

`rw-paper-command`, `rw-paper-nav`, `rw-paper-panel` (optional `data-accent`), `rw-paper-console` and `rw-paper-sheet` opt into warm paper, forest ink and walnut edges. Compose them with existing command-bar, folio-tab, panel and sheet primitives. They do not position a game HUD in the viewport.

`rw-season-cover`, `rw-season-cover__copy`, `rw-season-cover__art` and `rw-season-facts` compose a semantic illustrated season summary. Hosts supply headings, definition-list values and image URLs; artwork is decorative (`alt=""`). The example illustration is included in `examples/assets/studio/season-trophy.webp`. No private product content is required. Copy determines minimum height; container queries stack unusually narrow covers and long values wrap.

`rw-segmented[data-variant="pace"]` gives native buttons stable, equally sized targets, optional `small` descriptions and a high-contrast selected face. Use `role="group"` and one `aria-pressed="true"`; application code owns state. Unlike a toolbar, it needs no custom arrow-key model. Warm and disabled states, keyboard focus, reduced motion and forced colors are supported. The original pill variant remains available.


### Quiet history and line plots

`renderHistory({ plot: "line" })` draws straight SVG segments through actual observations, with a subtle fill to zero. Null values break both line and fill; a single observation stays a point. The default remains `columns`. Native note buttons and the exact-values disclosure remain available for either plot. SVG is decorative: the semantic observation list and table retain the full dataset without SVG support. No animation or interpolation is applied. Forced colors use CanvasText strokes with no fill.

The opt-in `styles/quiet.css` appearance removes instrument hardware decoration and defines `--rw-type-caption`, `--rw-type-body`, `--rw-type-heading`, and `--rw-type-value`. Hosts can override these type tokens without duplicating chart styles. Charts retain a zero-inclusive scale; a line does not imply observations between checkpoints.

## Dialog state and component sizing

Dialogs use native `:open`, `@starting-style` and discrete `display`/`overlay`
transitions. Reduced motion disables both surface and backdrop transitions and
close-button transforms. The dialog is an inline-size container: below 400px of
content width, header spacing shrinks and footer actions stack without changing
DOM or keyboard order. Explicit stacked footers also preserve DOM order, matching visual and keyboard
progression. `text-wrap: balance` improves headings and `text-wrap: pretty` improves body
copy; engines without those text enhancements use ordinary wrapping. Container
queries and `:open` are the modern baseline; no JavaScript layout fallback is
provided. Scroll containment prevents a long dialog from chaining to its page.

The optional policy helper requires native `showModal()` and `close()`. Native
`requestClose()` and `closedBy` are progressive enhancements. When missing, the
helper routes close requests through a cancelable event and recognizes matching
backdrop pointer gestures locally. Native focus and inertness remain unchanged;
required decisions retain a live cancel guard. Call `refresh()` when policy changes.
