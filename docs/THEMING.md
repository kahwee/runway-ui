# Themes and density

Set `data-theme="orbital"` or `data-theme="parchment"` on `g-ui`; Studio is the default. Set `data-density="compact"` for tighter shared control and panel spacing. The options workbench lets you compare these settings.

Override `--g-accent`, `--g-bg`, `--g-surface`, `--g-raised`, `--g-soft`, `--g-ink`, `--g-muted`, `--g-line`, `--g-font` and `--g-radius` on the root. See `styles/tokens.css` for all defaults. Unlayered host CSS takes precedence over the library's named layers.

Control tokens: `--g-control-font`, `--g-control-block`, `--g-control-inline`, `--g-control-gap`, `--g-panel-padding`, `--g-field-padding`, `--g-space` and `--g-choice-padding`. Component `data-size` overrides shared button padding; compact density remains independent of theme.

Nested `g-ui` roots reset defaults. Top-level native dialogs need their own `g-ui` plus the selected theme and density. They do not inherit tokens from an unrelated preview sibling. Keep focus states visible and verify contrast when supplying custom colors.


## Tactile defaults

Studio now uses warmer paper surfaces, a 12px radius, 13px default button text and raised button edges. Tokens `--g-highlight`, `--g-control-edge`, `--g-control-depth` (3px), `--g-select-inset` (16px), and `--g-display-font` expose the recipe. `data-depth="flat"` removes shared elevation, including in Orbital and Parchment. Component `data-elevation="flat"` still removes a single panel's shadow. These are visual changes; native behavior and existing class names are retained.

The rounded display stack applies only to explicit `g-panel__title` headings. Host headings and body text are not globally restyled. Personality belongs in the example content, colors and small details; status, costs and consequences should stay precise.

See [native fields](FIELDS.md) for arrow spacing, RTL, listboxes and progressive pickers.
