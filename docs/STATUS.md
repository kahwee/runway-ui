# Status

Version 0.2.0 is early-stage source available on GitHub. It is not yet published to the npm registry. Public API changes are possible while the library matures.

## Supported scope

- Framework-independent CSS/HTML presentation for desktop management and simulation interfaces.
- Native HTML dialogs, table-based horizontal bars and subgrid production ledgers.
- Optional roving keyboard focus, standard-mapped controller adapter and fixed-height virtual inventories.
- Zero runtime dependencies; a committed CSS bundle can be used directly.

## Limitations

- Physical controller input is implemented but has not been verified on hardware in the current development environment.
- No comprehensive screen-reader, accessibility-conformance or cross-browser audit has been completed.
- Virtual inventory uses fixed row heights; it does not implement drag/drop, item stacking, server pagination or variable-height rows.
- Off-screen virtual items are omitted from the DOM. Search and logical keyboard navigation help access items, but screen-reader browse-mode behavior requires further work.
- A 10,000-item synthetic catalog demonstrates bounded DOM rendering, not a population simulation or frame-rate guarantee.
- The CSS is namespaced but host styles can still override it. There is no Shadow DOM boundary.
- Charts currently supply simple positive horizontal bars. There is no chart engine, game loop, renderer, networking or persistence layer.

Current browser observations and packaging results are recorded here after each focused development pass. They do not imply certification across all supported browsers.

## October 21, 2026 desktop pass

- Workshop checked at 1440 × 900 and 1366 × 768 with the bundled stylesheet; measured no horizontal overflow. Computed production rows use subgrid.
- Native dialog opened in the top layer; Escape dismissed it and restored focus to its opener.
- The standalone inventory reached and selected item 10,000 with 40 mounted buttons in comfortable mode.
- Compact mode rendered 64px rows and 56px cells, and still reached item 10,000. A density change tears down/remounts the grid.
- Filtering produced one result and an empty state; advancing the colony updated cycle 2. No console errors in the final inventory pass.
- Package dry run included the full MIT license and single-file CSS bundle.

These are focused desktop Chromium observations. They do not establish physical-controller support, screen-reader conformance or cross-browser certification.
