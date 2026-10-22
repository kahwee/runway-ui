# Changelog

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
- Split shared controls and fields from layout primitives; native form styling reuses those modules. The full bundle includes opt-in `g-native` selectors.
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
