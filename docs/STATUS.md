# Status

Version 0.4.0 is early-stage source available on GitHub. It is not yet published to the npm registry. Public API changes are possible while the library matures.

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

## 0.3.1 focused desktop refinement

- Chart lab manually reviewed at 1366 × 768 and 1440 × 900: no horizontal page overflow; diverging scale and plot bounds align through shared columns.
- Storybook one-column cards in a 500px panel retain one 500px track. Description margins remain zero and the long action label stays within its button.
- Shared cards use 10px internal row gaps with aligned footers. Compact density supplies an 8px internal gap.
- The chart lab and generated chart guide have distinct URLs, including on case-insensitive filesystems.
- CSS, Storybook and documentation site builds succeeded. These are focused Chromium observations, not cross-browser or accessibility certification.

## 0.4.0 Observatory desktop pass

- CSS, HTML Storybook and self-contained site builds succeeded. Package dry run includes the new style modules, independent example modules and MIT license.
- Manually reviewed the standalone composition at 1366 × 768 and 1440 × 900: no horizontal page or ledger overflow. The ledger computes column subgrids; axis label centers align with the plot's top/middle/bottom positions.
- Storybook indexes 26 arguments and the shortage, missing and boundary fixtures. Orbital/compact/flat boundary composition keeps equal-height metric cards and fits both desktop targets with long resource labels.
- Missing fixture: two visibly missing slots, three projected slots, unavailable latest comparison and open exact data. Missing readings are excluded from the recorded-value count.
- Zero fixture: all 12 history marks measure zero height, including projected marks. An early projected-border minimum-height artifact was removed before the final build.
- Insufficient budget disables the upgrade review with an explanation. Selecting Water updates its inspector and dialog. Pinning a plan closes the native dialog, returns focus to its opener and reports that no resources were spent. Dialog return values reset before reopening.
- Native event popover opens and Escape dismisses it. A left-edge event note remains inside the viewport with CSS anchor positioning and named position-try fallbacks. No positioning JavaScript is used.
- Ledger End-key scrolling changes the native scroll position and CSS timeline cue. Reduced-motion emulation computes no cue animation and zero popover transition duration. A 900px viewport shows only the desktop-required notice.
- Out-of-scale data displays an alert instead of a clipped chart. The observed current Chromium uses the dialog-command bridge; native command attributes remain available for supporting engines.

These are focused manual Chromium observations and build/packaging results. Forced-color rules are supplied but this pass does not certify their rendering, screen-reader behavior or Safari/Firefox compatibility. The reference has no simulation backend or persistent game state.
- Follow-up manager review: the Observatory declares a 1366 × 900 viewport. A manager-only flex-shrink correction preserves that 900px iframe height with Controls open; the manager scrolls the fixed desktop canvas instead of triggering the unsupported-screen notice. This does not change runtime component sizing.
