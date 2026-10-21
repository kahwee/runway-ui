# Runway UI

**Modern HTML/CSS interfaces for management and simulation games.**

Resource HUDs, production ledgers, economy charts, equipment grids, objectives and native dialogs. Framework-independent, themeable, and zero runtime dependencies. Optional ES modules add keyboard navigation, controller input and virtual inventories.

**MIT licensed. Free for personal and commercial projects, including closed-source games.** Keep the license notice in redistributed copies. No attribution in your interface is required. See [LICENSE](LICENSE).

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

Open `http://127.0.0.1:4320/` for the component workshop. Other examples:

- `examples/colony.html`: production, reserve history and a searchable 10,000-item synthetic inventory.
- `examples/drop-in.html`: opt-in styling for existing native form controls.

The examples target desktop windows at least 1100 × 640. The CSS library itself does not impose a viewport gate.

## What's included

| Module | Components |
|---|---|
| Foundations | Theme tokens, cascade layers, surfaces, typography, focus and state colors |
| Primitives | Buttons, panels, badges, inputs, disclosures, native dialog styling |
| Game patterns | Resource HUD, equipment slots, objectives, choices, action dock |
| Simulation | Subgrid production ledger, HTML-table bar chart, container-aware panels |
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
