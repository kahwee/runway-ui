# Components and theming

Load `dist/runway-ui.css` for one request, or `index.css` to use the source modules. The optional native form skin is separate in `styles/native.css`.

## Root and theme

```html
<div class="g-ui" data-theme="orbital">
  <!-- Components -->
</div>
```

The default theme is Studio. Use `orbital` or `parchment` to change art direction without replacing markup. Top-level dialogs need their own `g-ui` class and the selected theme attribute.

Override tokens on your application root:

```css
.my-world {
  --g-accent: #41705c;
  --g-on-accent: #ffffff;
  --g-radius: 8px;
}
```

Token groups: `--g-bg`, `--g-surface`, `--g-raised`; `--g-ink`, `--g-muted`, `--g-line`; `--g-accent`, `--g-on-accent`, `--g-soft`; `--g-gold`, `--g-danger`, `--g-focus`; `--g-radius`, `--g-shadow`, `--g-font`.

## Actions and panels

```html
<section class="g-panel" aria-labelledby="production">
  <h2 id="production">Production</h2>
  <button class="g-button" data-variant="primary">Build</button>
  <button class="g-button" data-variant="secondary">Inspect</button>
  <button class="g-button" data-variant="danger">Demolish</button>
  <button class="g-button" disabled>Locked</button>
</section>
```

Variants are primary, secondary and danger. Use native buttons for actions and native disabled state. The CSS library does not attach click handlers.

## Progress

```html
<div class="g-meter" data-tone="warning">
  <div class="g-meter__label"><span>Readiness</span><span>38%</span></div>
  <div class="g-meter__track" role="progressbar" aria-label="Readiness"
       aria-valuemin="0" aria-valuemax="100" aria-valuenow="38">
    <div class="g-meter__fill" style="--g-value:38%"></div>
  </div>
</div>
```

Update the visible label, aria-valuenow and CSS value together. Set `--g-meter-height` and `--g-meter-color` to customize appearance. CSS clamps the painted fill; the host validates values. Needs can use appropriate native meter semantics; styling native meter elements is not currently included.

## Subgrid ledger

```html
<div class="g-ledger" role="table" aria-label="Production">
  <div class="g-ledger__row" role="row" data-heading>
    <span role="columnheader">Resource</span><span role="columnheader">Stored</span>
    <span role="columnheader">Made / cycle</span><span role="columnheader">Used / cycle</span>
  </div>
  <div class="g-ledger__row" role="row">
    <strong role="rowheader">Oxygen</strong><span role="cell">120</span>
    <span role="cell">24</span><span role="cell">18</span>
  </div>
</div>
```

The parent owns four shared columns; each row uses `grid-template-columns: subgrid`. Override the parent's tracks for your content. Use actual HTML tables when table semantics or complex headers are more important than the composed layout; this ARIA ledger has not received a screen-reader audit.

## Simple chart

```html
<table class="g-chart">
  <caption>Oxygen reserves · scale 0–300 units</caption>
  <thead><tr><th scope="col">Cycle</th><th scope="col" class="g-chart__axis">Reserve</th><th scope="col">Units</th></tr></thead>
  <tbody><tr><th scope="row">1</th><td><span class="g-chart__plot" style="--g-value:40%" aria-hidden="true"></span></td><td>120</td></tr></tbody>
</table>
```

The host maps quantities to a declared scale; actual values remain readable HTML. Use an established SVG/Canvas chart engine for dense histories, zoom, negative values, mixed axes or large time series. This module currently supplies horizontal bars only.

## Native dialog

```html
<dialog id="decision" class="g-ui g-dialog" aria-labelledby="decision-title">
  <h2 id="decision-title">Start the expedition?</h2>
  <form method="dialog"><button class="g-button" value="cancel">Cancel</button></form>
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

The workshop includes `.g-resource`, `.g-slots` / `.g-slot`, `.g-objectives`, `.g-choice` and `.g-dock`, plus native disclosures and badges. Interactive selection uses application-owned aria-pressed. Copy semantic markup from the examples and attach your own rules.
