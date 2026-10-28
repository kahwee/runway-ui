# Themes and density

Set `data-theme="orbital"` or `data-theme="parchment"` or `data-theme="whimsy"` (playful violet, extra-round, springy) on `rw-ui`; Studio is the default. Set `data-density="compact"` for tighter shared control and panel spacing. The options workbench lets you compare these settings.

Override `--rw-accent`, `--rw-bg`, `--rw-surface`, `--rw-raised`, `--rw-soft`, `--rw-ink`, `--rw-muted`, `--rw-line`, `--rw-font` and `--rw-radius` on the root. See `styles/tokens.css` for all defaults. Unlayered host CSS takes precedence over the library's named layers.

Control tokens: `--rw-control-font`, `--rw-control-block`, `--rw-control-inline`, `--rw-control-gap`, `--rw-panel-padding`, `--rw-field-padding`, `--rw-space` and `--rw-choice-padding`. Component `data-size` overrides shared button padding; compact density remains independent of theme.

Nested `rw-ui` roots reset defaults. Top-level native dialogs need their own `rw-ui` plus the selected theme and density. They do not inherit tokens from an unrelated preview sibling. Keep focus states visible and verify contrast when supplying custom colors.


## Tactile defaults

Studio now uses warmer paper surfaces, a 16px radius, 13px default button text and raised button edges. Tokens `--rw-highlight`, `--rw-control-edge`, `--rw-control-depth` (3px), `--rw-select-inset` (16px), and `--rw-display-font` expose the recipe. `data-depth="flat"` removes shared elevation, including in Orbital and Parchment. Component `data-elevation="flat"` still removes a single panel's shadow. These are visual changes; native behavior and existing class names are retained.

The rounded display stack applies only to explicit `rw-panel__title` headings. Host headings and body text are not globally restyled. Personality belongs in the example content, colors and small details; status, costs and consequences should stay precise.

See [native fields](FIELDS.md) for arrow spacing, RTL, listboxes and progressive pickers.

Set `data-skin="play"` for tactile instrument surfaces; see [instruments](INSTRUMENTS.md). Theme, density, depth and material are independent settings. Copy them to separately rooted dialogs.

## Ledger

Use `data-theme="ledger"` for cream paper surfaces, forest-green actions, brass borders and serif display type. See [desktop workspaces](WORKSPACES.md) for complementary layout components.

## Midnight

Set `data-theme="midnight"` on a `rw-ui` root for a neutral black background,
dark surfaces and pale blue accents. Native controls use `color-scheme: dark`.
Import `styles/themes.css` after the component entries, or use the full bundle.

## Cozy

Set `data-theme="cozy"` (the default of the React `Runway` root) for a soft, sweet
sim-game look: warm cream paper, plum ink, pastel rose, butter, mint, sky and lilac
accents, 22px radius, springy pill buttons and a rounded desk workspace. The palette is
exposed as `--rw-cozy-rose`, `-butter`, `-mint`, `-sky` and `-lilac`; TanStack charts
inside the root use `--ts-chart-1` to `--ts-chart-6`. Motion respects
`prefers-reduced-motion`; forced colors restores system surfaces and borders.

Cozy motion (`styles/cozy/motion.css`): siblings rise in one after another (using `sibling-index()` where
supported, otherwise together), meters bounce and flash on change, and `data-attention` buttons
pulse a ring. Generic number, toast and confetti styles live in `styles/feedback.css`.

## Cozy night

Set `data-theme="cozy-night"` (or `theme="cozy-night"` on `Runway`) for the same shapes, springs and
motion under lamplight: plum paper, a warm glow from the top right, faint stars and brighter pastels.
It reuses every cozy rule through `:is([data-theme="cozy"], [data-theme="cozy-night"])`; only tokens
differ (`styles/cozy/night.css`). Cozy surfaces use `--rw-cozy-paper`, `--rw-cozy-gloss`,
`--rw-cozy-shade`, `--rw-cozy-bar` and `--rw-cozy-on-pastel` instead of fixed colors, so a custom theme
can restyle them. Corners use `corner-shape: squircle` where supported. Touch devices get 48px
targets, hover lifts only on hover-capable devices, and a sticky thumb-reach action bar under 700px.

## Scale tokens

Use these instead of literal pixel values in components and apps, so themes and density apply everywhere.

| Token | Default | Meaning |
| --- | --- | --- |
| `--rw-space-unit` | `4px` (`3px` compact) | Base step. Every spacing token is a multiple of it. |
| `--rw-space-1` ... `--rw-space-6`, `--rw-space-8` | 1×, 2×, 3×, 4×, 5×, 6×, 8× the unit | Padding, gaps and margins. |
| `--rw-radius-sm`, `-md`, `-lg`, `-xl` | 0.5×, 0.875×, 1.125×, 1.5× `--rw-radius` | Corner radii that follow the theme: a theme with square corners squares them all. |
| `--rw-tap-target` | `44px` | Minimum touch target height. |
| `--rw-measure` | `760px` | Readable column width for lists and forms on wide screens. |
| `--rw-border-width` | `1px` | Standard border. |

```css
.roster-card {
  padding: var(--rw-space-3) var(--rw-space-4);
  border: var(--rw-border-width) solid var(--rw-line);
  border-radius: var(--rw-radius-lg);
  min-block-size: var(--rw-tap-target);
}
```
