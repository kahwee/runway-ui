# Options and behavior API

Use the [interactive reference](index.html#reference) for component option tables and copyable markup. [Charts](CHARTS.md) have a separate numeric and scale contract.

- Buttons: `data-variant="primary|secondary|danger"` (omit for neutral), `data-size="sm|md|lg"`, boolean `data-block`, native `disabled`, `aria-busy`.
- Panels: `data-elevation="flat"` removes the raised shadow.
- Badges: `data-tone="warning|danger"` supplies optional tones.
- Inputs: native `disabled`, `readonly`, constraints and `aria-invalid="true"`; preserve associated labels and validation text.
- Roots: `data-theme="studio|orbital|parchment"`, `data-density="comfortable|compact"`.

`bindDialog(dialog, {canDismiss})` returns `open()`, `requestClose(returnValue?)`, `refresh()` and `destroy()`. Call `refresh()` when dismissal policy changes while the dialog is open. `requestClose()` returns whether a request was issued; other cancel listeners can still veto closure. `destroy()` removes helper listeners and restores the original `closedby` attribute; it does not close the dialog. Explicit decision buttons can use a native `form method="dialog"`.

`bindNavigation(root, options)` exposes `refresh()`, `move(direction)`, `activate()` and `destroy()`. Refresh after DOM changes. Hidden, inert, disabled and aria-disabled candidates are skipped; editing controls keep their native arrow behavior. Destroy restores managed tabindex values, including candidates removed before a refresh. Column count must be a positive integer.

`createInventory(root, options)` owns the root's contents while mounted; use a dedicated empty root. Fixed row heights and column counts must agree with CSS. See exported declarations and [interaction guide](INTERACTIONS.md) for the complete contracts. Replacing data while focused keeps focus in the grid; filtering from an outside input keeps focus there.
