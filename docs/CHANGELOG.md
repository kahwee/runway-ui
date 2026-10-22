# Changelog

## Unreleased — cuter defaults

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

## Chart and documentation refinement

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
