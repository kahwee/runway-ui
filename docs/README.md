# Documentation map

New to Runway UI? Follow **Install → Components → Compose**. Use Storybook when you want to experiment with component arguments; use the guides for markup, requirements and behavior contracts.

## 1. Install and understand the basics

- [Installation and first component](../README.md#start-with-one-stylesheet): load the bundle and add a `rw-ui` root.
- [Component guide](COMPONENTS.md): the core markup patterns.
- [Themes and tokens](THEMING.md): theme, density, depth and material.
- [Compatibility policy](STABILITY.md): what the pre-1.0 contract means.

## 2. Find a component or behavior

| Need                                           | Read                                  | Try                                                                                    |
| ---------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------- |
| Classes, options and defaults                  | [API overview](API.md)                | [Searchable component reference](index.html#reference)                                 |
| Inputs, selects and validation                 | [Fields](FIELDS.md)                   | [Native controls example](../examples/controls.html)                                   |
| Dialog structure and dismissal                 | [Dialog](DIALOG.md)                   | [Storybook dialog](../storybook/?path=/story/foundations-dialog--playground)           |
| Icons and weights                              | [Icons](ICONS.md)                     | [Component reference](index.html#reference)                                            |
| Charts and numeric scales                      | [Charts](CHARTS.md)                   | [Chart lab](charts.html)                                                               |
| Signed histories and event notes               | [History instruments](INSTRUMENTS.md) | [History playground](../storybook/?path=/story/charts-history-instruments--playground) |
| Keyboard navigation, inventories and lifecycle | [Interactions](INTERACTIONS.md)       | [Inventory example](../examples/colony.html)                                           |

## 3. Compose an interface

- [Design and usage review](DESIGN-REVIEW.md): composition rules and twelve focused checks.

- [Desktop workspaces](WORKSPACES.md): command bars, folio navigation, dossier rows and control consoles.

- [Modern CSS and browser capabilities](MODERN-CSS.md), with the [shared-track layout example](../examples/layouts.html).
- [Simulation Observatory guide](OBSERVATORY.md), with the [complete screen](../examples/observatory.html).
- [Workshop](../index.html): a management interface assembled from the library.
- [Illustrated navigation](../examples/view-tabs.html) and [existing-form styling](../examples/drop-in.html).

## Project reference

- [Storybook workflow](STORYBOOK.md): local development and argument-driven stories.
- [Status and verification limits](STATUS.md): implemented scope and recorded checks.
- [Changelog](CHANGELOG.md): release and migration history.
- [Source ownership and CI](MODULES.md) and [ten-pass audit](AUDIT.md).
- [Contributing and source layout](../CONTRIBUTING.md): where to make changes.

Source Markdown guides live alongside the interactive documentation. The site build renders them as HTML and rewrites their guide links. Existing guide filenames remain stable so external links continue working.
- [Lazy game features and reusable action routing](LOADING.md), with the [supply desk example](../examples/lazy-workspace/index.html).

- [Generated types and behavior ownership](TYPES.md): source of truth, consumer contracts and module map.
