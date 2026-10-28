# Migrating to the React API

Runway UI is React-first. The package is `@kahwee/runway-ui`; React 19, Base UI and
`@tanstack/charts` are required peers. The CSS (`@kahwee/runway-ui/bundle.css`) is still a
standalone stylesheet, and existing `rw-` class names are unchanged.

| Before | Now |
| --- | --- |
| `bindDialog(dialog, { canDismiss })` | `<Dialog open onClose canDismiss />` |
| `createInventory(root, { items, onSelect })` | `<Inventory items selected onSelect />` |
| `bindRanges(root, { format })` | `<Range label format onValueChange />` |
| `renderHistory` and `mountHistoryWindow` | `Chart` with `defineChart` from `@tanstack/charts` |
| `createLazyResource`, `loadStylesheet` | `React.lazy` and dynamic `import()` |
| `createActionRouter` | React event handlers |
| `bindNavigation`, `bindGamepad` | Roving focus is built into `Inventory`; gamepad input is not ported |
| Hand-written `rw-` markup | `Panel`, `Badge`, `Meter`, `CommandBar`, `FolioTabs`, `Sheet`, `Dossier`, `ControlConsole` |

## Status

Removed already: `forms`, `history`, `timeseries`, `resource`, `styles` and `actions`.
Still present and deprecated: `dialog`, `navigation` and `inventory` under their old specifiers,
until the documentation site and workshop move to React. They receive no new features.

## Themes

Set `theme` on `Runway`. The new `cozy` theme is the default. Other themes keep their names.
Custom palettes override the `--rw-*` tokens on the root, as before.
