# Runway UI

**Modern HTML/CSS interfaces for management and simulation games.**

Resource HUDs, production ledgers, economy charts, equipment grids, objectives and native dialogs. Framework-independent, themeable, and zero runtime dependencies. Optional ES modules add keyboard navigation, controller input and virtual inventories.

**MIT licensed. Free for personal and commercial projects, including closed-source games.** Keep the license notice in redistributed copies. No attribution in your interface is required. See [LICENSE](LICENSE).

## Tactile history instruments

[Explore signed history instruments](https://kahwee.github.io/runway-ui/storybook/?path=/story/charts-history-instruments--playground): real observation arrays, explicit missing values, grouped native notes and exact tables. Add `data-skin="play"` to a `g-ui` root for deeper, more playful surfaces. [Contracts](docs/INSTRUMENTS.md).

## Simulation Observatory

[Open the polished desktop reference screen](https://kahwee.github.io/runway-ui/examples/observatory.html) · [Storybook playground](https://kahwee.github.io/runway-ui/storybook/?path=/story/compositions-simulation-observatory--playground) · [Data and capability contracts](docs/OBSERVATORY.md). Six CSS trend cards, observed/projected history, a target, anchored native event notes and an inspectable resource ledger. Generic synthetic data; no chart runtime.

## Modern CSS foundation

Subgrid aligns cards, fields, stat tiles, choices, objectives, production rows and chart series. Native nesting, container queries, logical sizing, OKLCH colors, typed meter properties and CSS-driven native disclosures are part of the implementation. Newer picker/chart/dialog capabilities use feature-aware enhancement. See the [modern CSS contract](docs/MODERN-CSS.md) and [shared-track workshop](examples/layouts.html).

## Comfortable defaults

Warm Studio colors, tactile controls and softly raised panels are the default. Add `data-depth="flat"` on a `g-ui` root for quieter surfaces. `select.g-input` reserves a 16px arrow inset and a separate text gutter, including RTL. `data-picker="enhanced"` progressively enables the newer native picker where supported. No JavaScript is needed for field styling.

See [the Clipboard Club](examples/controls.html) and [field documentation](docs/FIELDS.md), or tune the Select playground in Storybook. The bundle now includes the `g-native` opt-in selectors; `native.css` remains a compatible standalone form entry.

## Explore the library

- [Live workshop](https://kahwee.github.io/runway-ui/)
- [HTML Storybook](https://kahwee.github.io/runway-ui/storybook/) — focused argument-driven playgrounds, CSS charts and optional behaviors.
- [CSS chart lab](https://kahwee.github.io/runway-ui/docs/charts.html)
- [Component options](https://kahwee.github.io/runway-ui/docs/)

Storybook is development tooling only. Consuming the CSS library requires no JavaScript or framework.

## Start with one stylesheet

Download this repository and link the self-contained bundle:

```html
<link rel="stylesheet" href="./runway-ui/dist/runway-ui.css">

<section class="g-ui g-panel" data-theme="orbital" aria-labelledby="mission">
  <h2 id="mission">Prepare the expedition</h2>
  <button class="g-button" data-variant="primary">Launch</button>
</section>
```

Or install directly from GitHub:

```sh
npm install github:kahwee/runway-ui
```

```js
import 'runway-ui/bundle.css';
// Optional modular entry: import 'runway-ui';
import { bindDialog } from 'runway-ui/dialog';
```

This project is available on GitHub; **it has not been published to the npm registry**. GitHub installation is shown intentionally. The committed CSS bundle is ready to use without a build step. Node 22+ is needed only to rebuild it.

## Explore locally

```sh
python3 -m http.server 4320 --bind 127.0.0.1
```

Open **`http://127.0.0.1:4320/docs/charts.html`** for the CSS chart lab, or `http://127.0.0.1:4320/docs/` for searchable component options. The root page is the component workshop. Other examples:

- `examples/colony.html`: production, reserve history and a searchable 10,000-item synthetic inventory.
- `examples/drop-in.html`: opt-in styling for existing native form controls.

The examples target desktop windows at least 1100 × 640. The CSS library itself does not impose a viewport gate.

## What's included

| Module | Components |
|---|---|
| Foundations | Theme tokens, cascade layers, surfaces, typography, focus and state colors |
| Primitives | Buttons, panels, badges, inputs, disclosures, native dialog styling |
| Game patterns | Resource HUD, equipment slots, objectives, choices, action dock |
| CSS charts | Columns, stacked bars, diverging bars, six-point areas, legacy HTML-table bars; [API and scale rules](docs/CHARTS.md) |
| Simulation | Subgrid production ledger and container-aware panels |
| Themes | Warm Studio, dark Orbital and Parchment; identical markup |
| Optional behaviors | Native dialog dismissal policy, roving keyboard focus, standard controller adapter, fixed-height virtual inventory |

All component classes use `g-`; the root `g-ui` supplies inherited tokens without a global reset. Application styles can override the cascade layers. This is a CSS namespace, not Shadow DOM isolation.

## Easy adoption

1. **Components:** add the stylesheet, a `g-ui` root and documented component classes.
2. **Existing forms:** additionally load `runway-ui/native.css` and add `g-native` to the root. Native submission and control semantics stay intact.
3. **Interactions:** import only the optional modules you need; retain their handles and call `destroy()` on unmount.

Runway UI is not an API-compatible replacement for another UI framework. Existing custom widgets may need markup changes. The CSS core does not run a simulation, store saves or render a world.

## Modern browser features

- **Subgrid** aligns production rows with their parent's shared columns.
- **Container queries** adapt panels to their allocated space.
- **Native HTML dialog** supplies top-layer modality, focus and background inertness.
- **Cascade layers, logical properties, custom properties, color-mix() and :has()** provide composition and theming.
- **@starting-style and discrete transitions** enhance dialog motion when supported.
- **Reduced motion and forced colors** adjust animation and state indicators.

Targets current desktop Chromium, Firefox and Safari with subgrid and container-query support. Newer dialog APIs have fallbacks. Desktop Chromium checks are documented in [STATUS.md](docs/STATUS.md); broader browser and assistive-technology validation remains work in progress.

## Documentation

- [Component markup and theming](docs/COMPONENTS.md)
- [Keyboard, controller and inventory contracts](docs/INTERACTIONS.md)
- [Status and current limitations](docs/STATUS.md)
- [Contributing](CONTRIBUTING.md)
- [MIT license](LICENSE)

## Development

```sh
npm run build
npm pack --dry-run
```

There are no third-party runtime dependencies and no font or asset downloads. The CSS bundle is generated from `index.css` and `styles/`; edit source modules and rebuild the bundle. Type declarations accompany every optional behavior.

Early-stage API: improvements should keep markup predictable, effects modest and boundaries explicit. Suggestions and small, focused contributions are welcome.

## Documentation

- [CSS charts](docs/CHARTS.md) — numeric inputs, scales, accessibility and fallbacks.
- [Options API](docs/API.md), [theming](docs/THEMING.md), [compatibility contract](docs/STABILITY.md) and [unreleased changes](docs/CHANGELOG.md).

## Documentation development and hosting

See the [Storybook guide](docs/STORYBOOK.md). Run `npm ci`, then `npm run storybook` for the HTML component explorer. `npm run build-site` creates the public allowlisted `.site/` folder with Storybook under `/storybook/`. GitHub Actions deploys it to GitHub Pages on pushes to `main`. npm package publication is separate.

Native dialog stories use HTML invoker commands (`commandfor`, `command="show-modal"`) and `form method="dialog"`. Older browsers can use the optional dialog helper. Native disclosures and form controls need no event handlers.

Dialog styling is opt-in with `g-dialog`, structured `g-dialog__header`, `__body` and `__footer` classes, plus compact/wide/danger modifiers. See the [dialog class guide](docs/DIALOG.md) and [dialog playground](https://kahwee.github.io/runway-ui/storybook/?path=/story/foundations-dialog--playground).
