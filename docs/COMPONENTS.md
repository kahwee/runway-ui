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
  <div
    class="rw-meter__track"
    role="progressbar"
    aria-label="Readiness"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="38"
  >
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
  <caption>
    Oxygen reserves · scale 0–300 units
  </caption>
  <thead>
    <tr>
      <th scope="col">Cycle</th>
      <th scope="col" class="rw-chart__axis">Reserve</th>
      <th scope="col">Units</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td><span class="rw-chart__plot" style="--rw-value:40%" aria-hidden="true"></span></td>
      <td>120</td>
    </tr>
  </tbody>
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
import { bindDialog } from "runway-ui/dialog";
const modal = bindDialog(document.querySelector("#decision"));
// Open from a user action: modal.open();
// Request policy-aware dismissal: modal.requestClose();
// On unmount: modal.destroy();
```

The browser owns focus/inertness. The helper uses current dismissal policy for Escape and backdrop requests; required choices can supply `canDismiss: () => false`. Explicit form submission or `dialog.close()` can still resolve a required choice. The host owns pausing, rendering, sanitization and updating the theme.

## Other patterns

The workshop includes `.rw-resource`, `.rw-slots` / `.rw-slot`, `.rw-objectives`, `.rw-choice` and `.rw-dock`, plus native disclosures and badges. Interactive selection uses application-owned aria-pressed. Copy semantic markup from the examples and attach your own rules.

## Additional patterns

Use the [field guide](FIELDS.md) for native switches, ranges, option cards and grouped inputs; the [modern CSS guide](MODERN-CSS.md) for shared-track cards, fields, stats and choices; and [instruments](INSTRUMENTS.md) for signed histories, windowed series and impact tables. The [API reference](API.md) lists all stylesheet and optional behavior entry points. Current recipes use the `rw-` namespace; historical prefix migration is recorded in the [changelog](CHANGELOG.md).

## Illustrated workspace navigation

[Open the daily-places example](../examples/view-tabs.html) · [Storybook playground](../storybook/?path=/story/game-patterns-illustrated-navigation--playground).

Use `nav.rw-view-tabs` with native `.rw-view-tab` links or buttons. Each destination has a decorative `.rw-view-tab__art` image and a visible text label. Set `aria-current="page"` on the active navigation link; application action buttons may use `aria-pressed` for selected state. Do not add `role="tab"` unless implementing the full tab/panel keyboard and ARIA contract. All destinations remain in the ordinary Tab order; routing and content updates belong to the host.

```html
<nav class="rw-view-tabs" aria-label="Workspace">
  <a class="rw-view-tab" href="/garden/" aria-current="page">
    <img class="rw-view-tab__art" src="garden.svg" width="48" height="48" alt="">
    <span>Garden</span>
  </a>
</nav>
```

Use `data-layout="inline"` for side-by-side art and labels. Tokens are `--rw-view-art` (48px), `--rw-view-min` (72px) and `--rw-view-gap` (6px). Labels wrap without fixed text heights. Keep the collection small enough for the available desktop panel; the pattern does not conceal destinations or provide routing. Selection retains a border and underline, focus is visible, forced colors use system colors, and reduced motion disables decorative movement. The six original SVG miniatures in the example are MIT licensed and optional; consumers can supply their own artwork.

### Section tabs

Use `nav.rw-section-tabs` containing `.rw-button` toggles for switching sibling views inside one workspace. Mark the active button with `aria-pressed="true"` and `data-variant="primary"`; others use `data-variant="secondary"`. Add `data-sticky` to pin the row to the top of its scroll container. As with illustrated navigation, this is not an ARIA tablist; the host owns routing and content updates.

```html
<nav class="rw-section-tabs" data-sticky aria-label="Workspace sections">
  <button type="button" class="rw-button" data-variant="primary" aria-pressed="true">
    Overview
  </button>
  <button type="button" class="rw-button" data-variant="secondary" aria-pressed="false">
    Reports
  </button>
</nav>
```

## Segmented control, person chip and leaderboard

[Segmented control](../storybook/?path=/story/game-patterns-segmented-control--playground) · [Person chip](../storybook/?path=/story/game-patterns-person-chip--playground) · [Leaderboard](../storybook/?path=/story/game-patterns-leaderboard--playground).

All three use native elements and application-owned state. Motion is a squash, stretch and landing bounce that plays when `aria-pressed` becomes true, and it is disabled under `prefers-reduced-motion`. Forced colors use system colors.

### Segmented control

A sunken pill track of mutually exclusive buttons, such as game speed. This is a toggle group, not an ARIA tablist or radio group; the host owns the selected state. Add `data-tone="warm"` or `"danger"` to tint a segment.

```html
<div class="rw-segmented" role="group" aria-label="Pace">
  <span class="rw-segmented__label" aria-hidden="true">Pace</span>
  <button type="button" class="rw-segment" aria-pressed="false">Care</button>
  <button type="button" class="rw-segment" aria-pressed="true">Steady</button>
  <button type="button" class="rw-segment" aria-pressed="false" data-tone="warm">Push</button>
</div>
```

### Avatar and person chip

`.rw-avatar` is a tinted tile for initials, an image or an icon. Set `--rw-avatar-hue` to any colour; `data-shape="round"` and `data-size="sm | lg"` adjust it. `.rw-person-chip` wraps an avatar, an optional name and a `.rw-person-chip__status` dot (`data-status="busy | away | alert"`). Avatar-only chips need an `aria-label`. `.rw-person-strip` lays out a wrapping row.

```html
<div class="rw-person-strip" role="group" aria-label="People">
  <button type="button" class="rw-person-chip" data-layout="inline" aria-pressed="true">
    <span class="rw-avatar" style="--rw-avatar-hue: #4f7fa8" aria-hidden="true">AL</span>
    <span>Ada Lane<small>Engineer</small></span>
    <span class="rw-person-chip__status" data-status="busy" aria-hidden="true"></span>
  </button>
</div>
```

### Leaderboard

A native table with a caption, `th scope` attributes, medal ranks (`.rw-rank[data-place="1"]` to `3`), a `.rw-leaderboard__who` cell, `data-numeric` cells with tabular figures, `.rw-outlook[data-direction="up | down | flat"]` pills and a highlighted `tr[data-you]` row. Set `--rw-row` on each row for the staggered entrance. Medals and arrows are decorative; the numbers and text carry the meaning.

```html
<table class="rw-leaderboard">
  <caption>
    Season standings
  </caption>
  <thead>
    <tr>
      <th scope="col">Rank</th>
      <th scope="col">Company</th>
      <th scope="col" data-numeric>Value</th>
      <th scope="col">Outlook</th>
    </tr>
  </thead>
  <tbody>
    <tr style="--rw-row: 0">
      <th scope="row"><span class="rw-rank" data-place="1">1</span></th>
      <td>
        <div class="rw-leaderboard__who">
          <span class="rw-avatar" aria-hidden="true">N</span
          ><span><strong>Northwind</strong><small>A neighbouring team</small></span>
        </div>
      </td>
      <td data-numeric>$4.2m</td>
      <td><span class="rw-outlook" data-direction="up">Climbing</span></td>
    </tr>
  </tbody>
</table>
```
