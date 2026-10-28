# Options and behavior API

Use the [interactive reference](index.html#reference) for component option tables and copyable markup. [Charts](CHARTS.md) have a separate numeric and scale contract.
- Buttons: `data-variant="primary|secondary|danger"` (omit for neutral), `data-size="sm|md|lg"`, boolean `data-block`, native `disabled`, `aria-busy`.
- Panels: `data-elevation="flat"` removes the raised shadow.
- Badges: `data-tone="warning|danger"` supplies optional tones.
- Inputs: native `disabled`, `readonly`, constraints and `aria-invalid="true"`; preserve associated labels and validation text.
- Roots: `data-theme="studio|orbital|parchment|whimsy"`, `data-density="comfortable|compact"`, `data-depth="flat"`, optional `data-skin="play"`.

`bindDialog(dialog, {canDismiss})` returns `open()`, `requestClose(returnValue?)`, `refresh()` and `destroy()`. The helper requires native `showModal()` and `close()`, and throws on unsupported elements. It uses native `requestClose()` and `closedBy` when present. Missing close-request support uses a cancelable `cancel` event before native `close()`; missing light-dismiss support uses a matching outside primary pointer gesture. It sets `closedby="none"` for required decisions and retains a live cancel-event guard. Optional dialogs use `any` with native light dismissal or `closerequest` with the local pointer fallback. Call `refresh()` when dismissal policy changes while the dialog is open. `requestClose()` returns whether a request was issued; other cancel listeners can still veto closure. `destroy()` removes helper listeners and restores the original `closedby` attribute; it does not close the dialog. Explicit decision buttons can use a native `form method="dialog"`.

`bindNavigation(root, options)` exposes `refresh()`, `move(direction)`, `activate()` and `destroy()`. Refresh after DOM changes. Hidden, inert, disabled and aria-disabled candidates are skipped; editing controls keep their native arrow behavior. Destroy restores managed tabindex values, including candidates removed before a refresh. Column count must be a positive integer.

`createInventory(root, options)` owns the root's contents while mounted; use a dedicated empty root. Fixed row heights and column counts must agree with CSS. See exported declarations and [interaction guide](INTERACTIONS.md) for the complete contracts. Replacing data while focused keeps focus in the grid; filtering from an outside input keeps focus there.

Dialogs use opt-in `rw-dialog` styling and BEM-style structure and modifiers. See [dialog classes](DIALOG.md) for sizes, tone, scrollable body and action layout.

## Optional module exports

All modules ship TypeScript declarations and have no runtime dependencies. Use the full CSS bundle unless deliberately composing the style prerequisites.

| Package entry          | Exports                         | Lifecycle                                                                    |
| ---------------------- | ------------------------------- | ---------------------------------------------------------------------------- |
| `@kahwee/runway-ui/dialog`     | `bindDialog`                    | `destroy()` restores the dismissal attribute and removes listeners           |
| `@kahwee/runway-ui/navigation` | `bindNavigation`, `bindGamepad` | Destroy both handles when unmounting                                         |
| `@kahwee/runway-ui/inventory`  | `createInventory`               | Owns its root contents; `destroy()` clears owned markup                      |

### Range outputs

Use the React `Range` component from `@kahwee/runway-ui/react`; it mirrors the value into an `<output>` and sets `--rw-fill`.

### Retired history renderers

`renderHistory` and `mountHistoryWindow` are no longer shipped. Use React `Chart`
and `ChartCard` with TanStack Charts. Existing history/instrument CSS remains
available for compatible markup; it does not provide a JavaScript renderer.

## Stylesheet entries

`@kahwee/runway-ui` loads modular CSS; `@kahwee/runway-ui/bundle.css` is self-contained. Named style aliases are `native.css`, `charts.css`, `dialog.css`, `controls.css`, `fields.css`, `layout.css`, `history.css`, `observatory.css`, `forms.css`, `icons.css`, `instruments.css`, `workspace.css`, `quiet.css` and `studio.css`. Source modules are also exposed through `@kahwee/runway-ui/styles/*`. Individual modules may require tokens and related styles; an alias does not imply a standalone bundle. Native form styling imports its prerequisites.

Lazy loading uses React and your bundler (`React.lazy`, dynamic `import()`); Runway no longer ships loaders.

Declarations are generated from strict TypeScript in each behavior. See [type generation and consumer contracts](TYPES.md); public object type names remain available as generated aliases.
