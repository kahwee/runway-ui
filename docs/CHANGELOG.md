# Changelog

## 1.3.0 — Base UI menus and TanStack-only charts (breaking CSS migration)

- Remove CSS plot geometry, sparklines and retired custom history/window drawing. TanStack Charts is the sole plotting engine.
- Migrate the chart lab, chart playground, Observatory, Colony and landing-page plots; preserve original units, missing/observed/projected data and exact tables.
- Keep `charts.css` for figure/table styling and the existing React Chart API. Old CSS mark classes no longer render plots; see [migration](CHARTS.md#migration-from-css-plots). No package version or release tag is created here.

- Add themed Base UI menus: `SelectMenu`, `ComboboxMenu` and `Popover` share one trigger, list and item look (`styles/fields/menus.css`). Portaled lists render their own `rw-ui` theme root, so they match the surrounding theme. Pass `container` (for example the enclosing `<dialog>`) so a list stays above a modal. The raw `Select` export is unchanged.
- Add optional React `Progress`, using labelled native progress semantics and shared meter tokens.

## TypeScript source migration

All authored modules, stories, examples, tests and tools now use TypeScript or
TSX. Public package specifiers and runtime behavior remain unchanged; executable
JavaScript and declarations are generated under `dist/` by `bun run build`.
Source archive consumers must install and build before using runtime exports.
The deployed website retains its browser JavaScript URLs. Type checks cover the
full source tree, with strict public APIs and strict React stories.


## 1.2.0

- Add scale tokens: `--rw-space-unit` and `--rw-space-1` to `--rw-space-8`, theme-following radii
  (`--rw-radius-sm`, `-md`, `-lg`, `-xl`), `--rw-tap-target`, `--rw-measure` and `--rw-border-width`.
  Compact density shrinks the spacing unit. Existing tokens and classes are unchanged. See
  [theming](THEMING.md#scale-tokens).

## 1.1.0

- Add the `cozy-night` theme and the `Icon` component. `CommandBar` stats, `FolioTabs` items and
  `Meter` accept an `icon`. Cozy rules now use color tokens instead of fixed values.
- Cozy motion and shape: real spring easing with CSS `linear()`, squircle corners, softer shadows, and
  a mobile and touch layer (48px targets, hover only where supported, safe areas, scrolling tab row,
  sticky action bar, full-width toasts). Add `haptic()` for vibration on touch devices.
- Desk example: icons, a visible chart curve from day 1 and numeric credits that count up.

## 1.0.0

First stable major release. The public React API (`Runway`, `Panel`, `Badge`, `Meter`, `Resource`,
`Button`, `Input`, `Range`, `Dialog`, `Inventory`, `CommandBar`, `FolioTabs`, `Sheet`, `Dossier`,
`ControlConsole`, `AnimatedNumber`, `Confetti`, `ToastProvider`, `useToasts`, `Chart`, `ChartCard`),
the `rw-` CSS vocabulary and the cozy theme are now under semantic versioning. No API changes from
0.7.0. Not verified: Firefox and Safari, full assistive-technology review and physical controllers;
see [stability](STABILITY.md).

## 0.7.0

First stable release under `@kahwee/runway-ui`, rolling up the 0.6.0 betas.

- Toasts now use Base UI Toast. **Breaking since 0.6.0-beta.1:** `Toaster` is removed; mount `ToastProvider`
  inside `Runway` and call `useToasts().push(message, tone)`. Toast tone styling keys on `data-type`.

- Fix React `Range` controlled values and consumer styles; use the shared range
  layout with explicit native label/output associations. Its wrapper is now a
  `div.rw-field.rw-range-field` with a separate label, output and input; update any
  consumer selectors that depended on the previous wrapping label.
- Keep React `Inventory` keyboard focus on enabled slots and retain the Tab entry
  through item reordering, removal and disabled-state changes. Normalize invalid
  column counts to keep keyboard movement consistent with the rendered grid.
- Match React `Meter` accessible values to its clamped visual range, including
  nonfinite inputs and invalid maxima. Add interactive React control stories.

- Motion and delight: `AnimatedNumber`, `Confetti`, `Toaster` and `useToasts`;
  `Meter` flashes on change and pulses when low; staggered cozy entrances, bouncier hover and a
  `data-attention` ring; new `styles/feedback.css`. Cozy polish: readable rare tags, a cream dock and
  meter highlights. The desk example celebrates hires and counts up credits, with whole-day chart ticks.

- **Package renamed to `@kahwee/runway-ui`**, version `0.6.0-beta.0`, public access and the
  `next` dist-tag. Update specifiers from `runway-ui/...` to `@kahwee/runway-ui/...`. The package now
  ships `index.css`, `styles`, `dist`, `docs`, `README.md` and `LICENSE` only; sources,
  examples and scripts stay in the repository. Published to npm as `@kahwee/runway-ui@0.6.0-beta.0` (`next`).
- Add the [React guide](REACT.md) component reference and the [migration guide](MIGRATION.md).

- **Breaking direction: React is now required.** `react`, `react-dom`, `@base-ui/react`
  and `@tanstack/charts` are non-optional peers, and `runway-ui/react` is the primary
  API. Added `Runway`, `Panel`, `Badge`, `Meter`, `Resource`, `CommandBar`, `FolioTabs`,
  `Sheet`, `Dossier`, `DossierList`, `ControlConsole`, `Chart` and `ChartCard`. Vanilla
  behavior modules are deprecated and will be removed in a later release; the CSS stays
  standalone.
- Add React `Dialog` (native modal with a cancel veto for required decisions), `Inventory`
  (slot grid with arrow-key roving focus) and `Range` (filled track and live output).
- **Removed** the vanilla `runway-ui/forms`, `history`, `timeseries`, `resource`, `styles`
  and `actions` modules, the lazy-workspace example and the history instrument story.
  Use `Range`, `@tanstack/charts` through `Chart`, and React/bundler lazy loading instead.
  `dialog`, `navigation` and `inventory` remain until the doc site and workshop are ported.
- Add the `cozy` theme (`styles/cozy.css`, one file per component in `styles/cozy/`):
  soft pastel surfaces, pill buttons with a candy lip, sticker badges, sticky-note
  folio tabs, a rounded command bar and console, and a `--ts-chart-*` palette for
  TanStack charts.

- Make the Observatory, workshop, documentation workbench and standalone examples
  responsive. Phone resource cards retain all accessible column headers, values,
  selection and review actions; the previous desktop-only gates are removed.
- Keep long review content inside the dialog body and improve the optional React
  form surface, select-popup bounds and aligned Base UI selection indicators.
- Add a guided Storybook welcome and interactive Recipe book with copyable HTML,
  contract links, editable controls and native dialog keyboard behavior.
- Link the first-panel recipes from the responsive workshop; align the explorer
  with Studio and add the Accessibility panel.
- Gate Pages publication on project-prefix browser, accessibility and interaction
  checks; validate links and story routes across the entire published site.

- Keep structured dialog actions visible while long bodies scroll, with wider
  narrow-screen content and 44px close targets. Native dismissal and focus remain
  unchanged.
- Adapt Storybook sample layouts, navigation and data scroll regions to narrow
  canvases; propagate toolbar themes into nested scopes. Improve small-text and
  avatar contrast without changing accent colors or numeric content.
- Add an explicit all-story browser layout check, including open-dialog states.

- Add optional `runway-ui/react` with React 19/Base UI forms, generated types and a live Storybook example. Vanilla exports and native dialog contracts are unchanged.

## Unreleased

- Run package validation and five viewport browser checks in parallel for npm
  releases. Use the GitHub runner's installed Chrome instead of downloading
  browsers/system packages. Preserve tag/OIDC restrictions, archive checksums
  and the combined viewport/manager coverage before publishing.
- Remove upstream identity/peer-render smoke tests and the temporary peer-install
  consumer from archive validation. Keep Runway behavior, exports, bundling and
  class-composition checks. Registry verification no longer waits before its
  first readback attempt.

- Fix React dialog backdrop dismissal when newer native close-request APIs are
  absent. Preserve cancellation vetoes, return values, primary-pointer guards
  and native focus/inertness; reset cancelled gestures and remove listeners.
- Keep cozy console status content visible and wrapping on narrow screens.
- Add React `InputScope`, `InputHints` and `InputBinding` for local remappable
  shortcuts, opt-in directional navigation and standard-gamepad input. Native
  editing, Tab, nested scopes and modal decisions retain their own contracts.
- Add a production Storybook busy-screen benchmark, raw local measurements and
  opt-in reference regression budgets. Remove obsolete history API guidance and
  update legacy setup/migration recipes without removing still-used exports.

- Give React components named source owners behind the same export-only public
  facade. Preserve all runtime exports, props, Base UI identity and CSS classes.
- Split chart, instrument and feedback styles into ordered component owners,
  keeping their existing aggregate imports, cascade layers and responsive states.
- Synchronize generated JavaScript and declarations by file type so successful
  rebuilds remove retired modules without deleting sibling outputs. Failed
  compilation preserves the last successful output; declaration check mode also
  detects retired files. Build scripts work from outside the repository directory.
- Enforce export-only React entry points and import-only CSS aggregates. Update
  contributor guidance and `AGENTS.md` with ownership and validation contracts.

- Add Bold icons for playback, fullscreen, guides, camera controls, stores and
  workplace equipment. All masks are embedded; consumers need no separate SVG files.

- Quiet fields retain the fallback single-select chevron. Surface color no longer
  resets the field background image; native and enhanced pickers keep their own
  arrow and reserved text space. Browser contracts cover this theme combination.

- Dialog stacked actions now follow DOM order instead of reversing it; place
  controls in the intended reading and keyboard order. Long-content typography,
  paragraph spacing and close targets are tightened. Add compact, long-content
  and required-decision stories and document validation before explicit close.
- Replace the workshop home mark's font-dependent arrow with the shared icon.

- **Breaking dialog migration:** import `dialog.css` with tokens when selecting
  individual modules; `primitives.css` and `simulation.css` no longer supply the
  dialog surface or motion. The full entry and bundle already include it.
- `bindDialog` now tolerates missing `requestClose()` and `closedBy` while still
  requiring native `showModal()` and `close()`. Local cancelable close requests and
  matching backdrop pointer gestures preserve vetoes and required-decision guards.
  Modern browsers retain native dismissal. No global polyfill, focus trap, runtime
  dependency or controller API change is introduced. Dialog CSS still uses `:open`.
- Dialog container queries stack compact action rows; balanced headings, pretty
  body wrapping and scroll containment improve layout. Reduced motion disables
  surface/backdrop transitions and close-button transforms.
- Add parallel lint, module-boundary and package checks, with Storybook on PRs.
  Generated CSS verification checks both `styles/icons.css` and the bundle.

- Add `rw-segmented` / `rw-segment`, `rw-avatar`, `rw-person-chip` and `rw-leaderboard` (with `rw-rank` and `rw-outlook`), each with a bouncy selection animation, reduced-motion and forced-colors support, a Storybook playground and stress cases.

- Make `rw-view-tabs` and `rw-dock` bouncier: a tray for illustrated tabs, squash-and-stretch pop when a tab or dock action becomes selected, hopping artwork, pill buttons and keycap-style `rw-shortcut` hints. All motion is disabled under `prefers-reduced-motion`.

- Add `rw-section-tabs`, a sticky row of toggle buttons for switching sibling views, with a Storybook playground.

- Add illustrated workspace navigation, a generic daily-places example with six original SVG miniatures, and an argument-driven Storybook playground.

- Consolidate the documentation index, complete optional-module exports and remove stale status/performance claims. Preserve the percentage chart contract.

- Playful customizable select: rich options with `selectedcontent`, staggered `sibling-index()` entry, spring checkmark, typed-`attr()` colour dots and a Foundations / Controls / Fun picker story.

- **Breaking: the `g-` prefix is now `rw-`.** Classes (`.g-button` → `.rw-button`), custom properties (`--g-accent` → `--rw-accent`), keyframes, container names and cascade layers (`game-ui.*` → `runway-ui.*`) all change; the root class is `.rw-ui`. Rename with `s/(?<![\w-])g-(?=[a-z])/rw-/` and `s/--g-/--rw-/` on your own markup and CSS.

- Add native-form skins: springy `rw-switch`, `rw-range` slider with optional `runway-ui/forms` output binding, `rw-check`, option cards, input groups, fieldsets and field-sizing textareas; add the Foundations / Forms story.

- Add `runway-ui/timeseries` (`mountHistoryWindow`): windowed time series with overview, native scrubber and pager; the history playground now defaults to 1,000 days and goes to 5,000.
- Fix narrow columns overflowing their track.

- Round the default radius to 16px, add pill badges with a status dot, pill meters with a springy fill, and springy lift on buttons and slots (reduced-motion safe).
- Add the pastel Whimsy theme (`data-theme="whimsy"`): lavender and violet with coral, mint and sun accents, sticker badges and a hover wiggle.

## 0.5.0 — tactile history instruments

- Add generic signed history markup with explicit gaps, up to 366 observations, grouped native event popovers and exact-value disclosures.
- Add typed history export and instrument CSS export, a shared impact subgrid, and an opt-in Play material for more tactile panels and controls.
- Add a configurable signed/zero/missing/custom instrument playground and material toolbar.
- Keep source/demo data generic; no runtime dependencies or domain-specific simulation rules.

Source and Pages update; no npm registry publication.


## 0.4.0 — Simulation Observatory

- Add a generic desktop reference composition with six CSS trend cards, a fixed-scale annotated history, striped projected observations, explicit missing readings and a target line.
- Add history/observatory CSS exports, subgrid metric/ledger layouts and a modular independent example renderer/controller.
- Add native anchored event popovers, a named CSS scroll-timeline cue and declarative dialog commands with an optional native bridge.
- Add a Storybook playground with 26 arguments plus shortage, missing and boundary fixtures, using a fixed desktop viewport alongside Controls; document data/capability contracts and exact tables.
- Maintain zero runtime dependencies, generic public material, reduced-motion/forced-color rules and desktop-only reference layouts.

Source and Pages update; no npm registry publication.


## 0.3.1 — tighter shared details

- Separate internal subgrid row spacing from group spacing in both densities.
- Preserve preferred single-column layouts under container queries; cap narrow stat panels at one column.
- Align chart axes with intrinsic label/plot/value tracks through nested column subgrids, removing fixed offsets.
- Bound long action and choice labels, align numeric costs and synchronize pressed control borders.
- Prevent Storybook typography from overriding card/field spacing; add an action-label argument.
- Allow disclosure focus outlines room inside the clipped transition.
- Give the chart guide a distinct generated URL so it cannot overwrite the interactive chart lab on case-insensitive disks.

Source and documentation update only; no npm registry publication.

## 0.3.0 — modern CSS and comfortable defaults

Source update for GitHub and the documentation site; no npm registry publication.

### Modern CSS layout baseline

- Add nested subgrid patterns for form fields, cards, stat tiles and priced choices.
- Convert objective lists and chart series to shared parent column tracks.
- Use named container queries, fluid cqi type and balanced/pretty text in new layouts.
- Convert runtime box dimensions to logical properties and derived colors to OKLCH mixing.
- Register typed percentage meter values and add CSS-only intrinsic native disclosure transitions.
- Document baseline versus newer enhancements; add an argument-driven subgrid playground and standalone example.


### Comfortable, playful defaults

- Warm Studio palette, raised controls, softer panel edges and configurable flat depth. Default radius changes from 10px to 12px; button text from 11px to 13px. These are intentional visual changes.
- Split shared controls and fields from layout primitives; native form styling reuses those modules. The full bundle includes opt-in `rw-native` selectors.
- Reserve an arrow/text gutter on native selects, flip it in RTL and retain listbox behavior.
- Add opt-in customizable native pickers behind a CSS support check, plus forced-color/reduced-motion accommodations.
- Add a richly configurable Select story, depth toolbar and generic Clipboard Club example. Existing g- classes, exports, dialog policy and chart behavior are retained.


### Argument-driven Storybook

- Consolidate repetitive snapshots into focused playgrounds with documented, categorized arguments and conditional controls.
- Add data validation and editable series to the chart playground.
- Add class-styled native dialog structure, compact/wide/danger modifiers and action layouts.
- Keep all component rendering HTML/CSS-first; JavaScript remains optional.

## Earlier chart and documentation refinement

- Add a dedicated CSS charts module: columns, stacked bars, diverging bars and six-point area plots, plus the preserved horizontal table API.
- Add chart lab, exact-data disclosures, fixed-scale datasets, theme/height/grid controls and copyable recipes.
- Use subgrid, container queries, typed attr() and shape() with documented progressive fallbacks.
- Add searchable component documentation and theme, density, size, state and dialog-policy controls.
- Consolidate spacing tokens, button sizes, flat panels and validation states.
- Refine dialog policy refresh and native dismissal, navigation eligibility/teardown and inventory focus retention.
- Document pre-1.0 compatibility and remaining release gates.

Added HTML Storybook covering visual components, charts, optional behaviors and compositions. GitHub Pages deployment runs from main; npm publication remains separate.

## 0.2.0

Initial standalone MIT distribution with modular CSS, optional behavior modules, desktop examples and a self-contained bundle.

## Optional feature loading

Added focused resource, stylesheet and action behavior entries, declarations and a standalone lazy workspace example. No runtime dependencies or automatic imports of application features.

## Generated behavior declarations

All nine optional behaviors now generate declarations from strictly checked JavaScript JSDoc. Existing public type names remain exported; object declarations are generated aliases, so declaration merging of the previous handwritten interfaces is no longer supported. Added consumer type fixtures and CI drift checks. Tightened DOM/event typing and windowed-history validation. Empty histories have finite geometry and disabled paging; destroyed timelines no longer redraw.
