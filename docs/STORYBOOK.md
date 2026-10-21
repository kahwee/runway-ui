# HTML Storybook

[Open the live explorer](https://kahwee.github.io/runway-ui/storybook/).

Storybook uses `@storybook/html-vite`, not a component framework. Stories render ordinary HTML strings or DOM elements using the same CSS shipped to consumers. The manager and documentation tooling use JavaScript; none of that is required to consume the stylesheet.

## Collection

- Start here: purpose, adoption and links to full compositions.
- Charts: columns, stacks, diverging bars, area, legacy table bars and zero values. Plot height and grid controls are available.
- Foundations: button controls and states, panels, badges, native forms, progress, disclosure, native dialog and the opt-in native form skin.
- Game patterns: resource HUD, equipment slots, objectives, choices, action dock, production ledger and composable layout.
- Behaviors: roving keyboard focus and a 10,000-item virtual inventory. These explicitly demonstrate optional JavaScript.
- Compositions: production and economy panels assembled from the public workshop.

Use the toolbar to select Studio, Orbital or Parchment and comfortable or compact density. The Docs entries show source and copyable markup. Button controls expose label, variant, size, disabled and full width. Static examples intentionally do not fabricate game logic: CSS does not spend credits or select equipment on its own.

## HTML before JavaScript

Use native input, select, progress, meter, details/summary and form reset behavior. The dialog story uses `commandfor`, `command="show-modal"`, `closedby` and `form method="dialog"`. These need current browser support. For older engines without invoker commands, the optional dialog helper provides `showModal()` opening and a dismissal policy.

CSS computes all chart geometry. Only the chart workbench controls update values and attributes. Aggregation, scale selection and missing-data handling belong to the application; see [chart contracts](CHARTS.md).

## Develop

```sh
npm ci
npm run storybook
```

Story sources live in `stories/`; toolbar defaults and shared CSS live in `.storybook/`. Keep theme-independent markup and real text values. Add stories for meaningful states, not every CSS declaration. Lifecycle hosts in behavior stories are documentation-only custom elements: they install one helper on connection and dispose it on disconnection.

```sh
npm run build-site
```

This builds the CSS bundle, Storybook and an allowlisted public `.site/` directory. Markdown guides become HTML at build time. No client-side Markdown renderer is shipped. `main` pushes deploy that output through GitHub Actions. Generated output, local evidence and node_modules are not committed.

This is desktop-oriented UI. Validate actual desktop canvases and compositions. Browser checks remain scoped observations, not accessibility or cross-browser certification.
