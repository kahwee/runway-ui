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
