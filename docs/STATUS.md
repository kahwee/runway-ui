# Status

The package metadata is version 1.0.0; see the [changelog](CHANGELOG.md) for what changed in each release. This file describes source scope and recorded checks, not a registry or live deployment check.

## Implemented scope

- Framework-independent HTML/CSS for responsive management and simulation interfaces, with zero runtime dependencies.
- Native fields, disclosures and dialogs; shared-track layouts, production ledgers and optional Play material.
- TanStack charts, signed histories with explicit gaps, native event notes and exact-data tables.
- Optional dialog policies, roving focus, standard-mapped controller input, fixed-height inventory virtualization, range outputs and windowed time series.
- Modular source CSS, a committed self-contained bundle, typed ES modules, standalone examples and HTML Storybook.

## Verification boundaries

Prior focused desktop Chromium passes covered 1440 × 900 and 1366 × 768 layouts, native dialog dismissal/focus, inventory navigation through a 10,000-item fixture, chart zero/boundary/missing data and Observatory event notes. These are recorded development observations, not fresh checks of every subsequent change. The Observatory now adapts to its actual Storybook canvas width; the responsive checks complement those earlier desktop observations.

Build and packaging checks establish generated artifacts and package contents only. See [Storybook development](STORYBOOK.md#develop-and-deploy) for current local commands. They do not establish publication or deployment.

## Recent focused verification

The dialog update was checked in Chrome 154 at 1440 × 900 and 1366 × 768:
compact/wide layouts, native light dismissal, required-decision Escape/backdrop
guards, reduced-motion surface/backdrop transitions and a visible forced-color
border. This is a focused check, not coverage of all components or browsers.
The [ten-pass audit](AUDIT.md) records subsequent documentation and tooling checks.

## Remaining limitations

- Firefox, Safari, screen readers, comprehensive forced-color coverage and physical controller hardware still need direct validation before broader support claims.
- Virtual inventories require fixed row heights. Off-screen items are absent from the DOM and may limit screen-reader browse mode. No drag/drop, stacking or server pagination is supplied.
- The direct history renderer supports up to 366 observations; the optional time-series module draws a bounded window of a longer host-owned series. Its overview averages bins and its exact table covers only the visible window. No general zoom/brush, automatic tick engine or irregular-time interpolation is provided.
- Namespaced CSS is not Shadow DOM isolation; host styles can override it.
- Examples are synthetic references with no simulation backend or persistent game state. Their layouts now adapt to phone, tablet and desktop widths without a desktop-only gate; hosts still own their data and actions.

Read [modern CSS](MODERN-CSS.md) for capability-specific degradation and [compatibility](STABILITY.md) for API policy.

## Scoped game input and busy-screen reference

The unreleased input scope has focused Chromium checks at 320px, 390px, 768px,
1366 × 768 and 1440 × 900 for remapping, native editing/Tab, nested scopes and
modal decisions. A native-modal fixture simulates missing newer dismissal APIs;
it does not establish support in another browser engine. Controller checks use
simulated standard pad snapshots, not physical hardware. See [game input](GAME-INPUT.md)
and [performance methodology and limits](PERFORMANCE.md).
