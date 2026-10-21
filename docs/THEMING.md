# Themes and density

Set `data-theme="orbital"` or `data-theme="parchment"` on `g-ui`; Studio is the default. Set `data-density="compact"` for tighter shared control and panel spacing. The options workbench lets you compare these settings.

Override `--g-accent`, `--g-bg`, `--g-surface`, `--g-raised`, `--g-soft`, `--g-ink`, `--g-muted`, `--g-line`, `--g-font` and `--g-radius` on the root. See `styles/tokens.css` for all defaults. Unlayered host CSS takes precedence over the library's named layers.

Control tokens: `--g-control-font`, `--g-control-block`, `--g-control-inline`, `--g-control-gap`, `--g-panel-padding`, `--g-field-padding`, `--g-space` and `--g-choice-padding`. Component `data-size` overrides shared button padding; compact density remains independent of theme.

Nested `g-ui` roots reset defaults. Top-level native dialogs need their own `g-ui` plus the selected theme and density. They do not inherit tokens from an unrelated preview sibling. Keep focus states visible and verify contrast when supplying custom colors.
