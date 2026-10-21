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
- Charts supply small HTML/CSS plots: columns, stacked and diverging bars, six-point areas and legacy horizontal bars. Arbitrary-length time series, automatic ticks and interactive chart-engine features are outside the current scope.

Current browser observations and packaging results are recorded here after each focused development pass. They do not imply certification across all supported browsers.

## October 21, 2026 desktop pass

- Workshop checked at 1440 × 900 and 1366 × 768 with the bundled stylesheet; measured no horizontal overflow. Computed production rows use subgrid.
- Native dialog opened in the top layer; Escape dismissed it and restored focus to its opener.
- The standalone inventory reached and selected item 10,000 with 40 mounted buttons in comfortable mode.
- Compact mode rendered 64px rows and 56px cells, and still reached item 10,000. A density change tears down/remounts the grid.
- Filtering produced one result and an empty state; advancing the colony updated cycle 2. No console errors in the final inventory pass.
- Package dry run included the full MIT license and single-file CSS bundle.

These are focused desktop Chromium observations. They do not establish physical-controller support, screen-reader conformance or cross-browser certification.

## Local chart refinement

- CSS chart lab checked at 1440 × 900 and 1366 × 768 with no measured horizontal overflow.
- Native typed attr() and shape() paths active in this desktop Chromium browser; columns computed subgrid tracks.
- Zero datasets produced zero-sized marks. Boundary datasets filled the column scale and exactly half the symmetric diverging track.
- Orbital theme, dataset reset and native exact-data disclosure exercised with no observed console errors.
- These observations cover the current browser, not Safari/Firefox, forced-colors rendering or screen-reader behavior. Progressive fallback rules are supplied but were not exercised in an older engine.
- Documentation workbench: compact padding and large button size observed; locked native dialog resisted Escape, then a live policy change enabled Escape and restored focus to the opener. Search reduced the reference to one matching chart entry. A stale cached behavior module initially caused errors; a fresh reload used the updated helper and completed these flows.

## Argument-driven Storybook refinement

- Consolidated repetitive snapshots into configurable playgrounds with categorized descriptions, defaults and conditional controls.
- Chart playground exposes data, plot type and scales; an invalid scale shows an explanation, and zero-area inputs matched six zero values in the data table. The second-series control appears for stacked bars.
- Dynamic Code source reflected changed dialog size classes. Styled wide dialog measured 760px at desktop size; restricted native dismissal resisted Escape. Confirming closed the modal and restored focus to the opener.
- The unstyled comparison had no dialog/header classes and retained native modality. Styling remains explicitly class-based.
- Main Storybook had no measured horizontal overflow at 1440×900 and 1366×768. Final focused browser passes had no console errors.
- An initial build used a metadata factory directly as the default CSF export; Storybook rejected indexing it. Object-literal exports with static title/tags resolved that issue; the final build succeeded.
- This remains focused desktop Chromium evidence; cross-browser, assistive-technology and physical-controller support are not certified.
