# Components and theming

Load `dist/runway-ui.css` for one request, or `index.css` to use the source modules. The optional native form skin is separate in `styles/native.css`.

## Root and theme

```html
<div class="rw-ui" data-theme="orbital">
  <!-- Components -->
</div>
```

The default theme is Studio. Use `orbital` or `parchment` to change art direction without replacing markup. Top-level dialogs need their own `rw-ui` class and the selected theme attribute.

Override tokens on your application root:

```css
.my-world {
  --rw-accent: #41705c;
  --rw-on-accent: #ffffff;
  --rw-radius: 8px;
}
```

Token groups: `--rw-bg`, `--rw-surface`, `--rw-raised`; `--rw-ink`, `--rw-muted`, `--rw-line`; `--rw-accent`, `--rw-on-accent`, `--rw-soft`; `--rw-gold`, `--rw-danger`, `--rw-focus`; `--rw-radius`, `--rw-shadow`, `--rw-font`.

## Actions and panels

```html
<section class="rw-panel" aria-labelledby="production">
  <h2 id="production">Production</h2>
  <button class="rw-button" data-variant="primary">Build</button>
  <button class="rw-button" data-variant="secondary">Inspect</button>
  <button class="rw-button" data-variant="danger">Demolish</button>
  <button class="rw-button" disabled>Locked</button>
</section>
```

Variants are primary, secondary and danger. Use native buttons for actions and native disabled state. The CSS library does not attach click handlers.

## Progress

```html
<div class="rw-meter" data-tone="warning">
  <div class="rw-meter__label"><span>Readiness</span><span>38%</span></div>
  <div class="rw-meter__track" role="progressbar" aria-label="Readiness"
       aria-valuemin="0" aria-valuemax="100" aria-valuenow="38">
    <div class="rw-meter__fill" style="--rw-value:38%"></div>
  </div>
</div>
```

Update the visible label, aria-valuenow and CSS value together. Set `--rw-meter-height` and `--rw-meter-color` to customize appearance. CSS clamps the painted fill; the host validates values. Needs can use appropriate native meter semantics; styling native meter elements is not currently included.

## Subgrid ledger

```html
<div class="rw-ledger" role="table" aria-label="Production">
  <div class="rw-ledger__row" role="row" data-heading>
    <span role="columnheader">Resource</span><span role="columnheader">Stored</span>
    <span role="columnheader">Made / cycle</span><span role="columnheader">Used / cycle</span>
  </div>
  <div class="rw-ledger__row" role="row">
    <strong role="rowheader">Oxygen</strong><span role="cell">120</span>
    <span role="cell">24</span><span role="cell">18</span>
  </div>
</div>
```

The parent owns four shared columns; each row uses `grid-template-columns: subgrid`. Override the parent's tracks for your content. Use actual HTML tables when table semantics or complex headers are more important than the composed layout; this ARIA ledger has not received a screen-reader audit.

## Simple chart

```html
<table class="rw-chart">
  <caption>Oxygen reserves · scale 0–300 units</caption>
  <thead><tr><th scope="col">Cycle</th><th scope="col" class="rw-chart__axis">Reserve</th><th scope="col">Units</th></tr></thead>
  <tbody><tr><th scope="row">1</th><td><span class="rw-chart__plot" style="--rw-value:40%" aria-hidden="true"></span></td><td>120</td></tr></tbody>
</table>
```

The host maps quantities to a declared scale; actual values remain readable HTML. For columns, stacked and diverging bars and six-point areas, see the dedicated [CSS charts guide](CHARTS.md) and [chart lab](charts.html). Use a plotting engine for dense histories, zoom, mixed axes or large time series.

## Native dialog

```html
<dialog id="decision" class="rw-ui rw-dialog" aria-labelledby="decision-title">
  <h2 id="decision-title">Start the expedition?</h2>
  <form method="dialog"><button class="rw-button" value="cancel">Cancel</button></form>
</dialog>
```

```js
import { bindDialog } from 'runway-ui/dialog';
const modal = bindDialog(document.querySelector('#decision'));
// Open from a user action: modal.open();
// Request policy-aware dismissal: modal.requestClose();
// On unmount: modal.destroy();
```

The browser owns focus/inertness. The helper uses current dismissal policy for Escape and backdrop requests; required choices can supply `canDismiss: () => false`. Explicit form submission or `dialog.close()` can still resolve a required choice. The host owns pausing, rendering, sanitization and updating the theme.

## Other patterns

The workshop includes `.rw-resource`, `.rw-slots` / `.rw-slot`, `.rw-objectives`, `.rw-choice` and `.rw-dock`, plus native disclosures and badges. Interactive selection uses application-owned aria-pressed. Copy semantic markup from the examples and attach your own rules.
