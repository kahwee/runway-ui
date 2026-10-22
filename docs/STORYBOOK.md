# Argument-driven HTML Storybook

[Open the explorer](https://kahwee.github.io/runway-ui/storybook/). It uses Storybook 10's HTML renderer: ordinary HTML/CSS rather than framework component wrappers. Storybook and its manager are development tools, not library runtime dependencies.

## Fewer stories, useful controls

Each visual playground exposes the values it actually renders. Descriptions, grouped control categories, explicit defaults and conditional fields make those options reviewable. For example, color appears only after enabling custom chart color; a cancel label appears only when a dialog has a cancel action.

| Playground                         | Important arguments                                                                                                                                                     |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CSS charts                         | Plot type, sample/custom/zero/boundary data, labels, both series, maximum, units, height, width, grid, table state and custom color                                     |
| Dialog                             | Content, class-based size/tone/footer, native dismissal policy, safe focus target, action labels, close/cancel visibility, disabled confirmation and styling comparison |
| Button                             | Content, variant, size, disabled, full width, pressed, busy and shortcut hint                                                                                           |
| Input                              | Type, content, placeholder, disabled, readonly, required, validation text, width and native skin                                                                        |
| Panel, badge, progress, disclosure | Content, surface/layout or meaningful native state                                                                                                                      |
| Game patterns                      | Real data arrays and selection/completion/disabled states, rather than fixed sample variants                                                                            |
| Optional behaviors                 | Navigation items, skip/wrap/column configuration; inventory count, columns, row height and overscan                                                                     |
| Composition                        | Heading, columns, visible panels and explanatory content                                                                                                                |

Theme, density, depth and material are global toolbar settings. They are not duplicated as unrelated per-component args. Control changes rerender the story; changing a dialog argument resets its native open state, so open it again after changing options. Copy current HTML from the Code panel or Docs source view. Native controls can also be edited directly in the preview; that interaction is separate from the story's initial args.

Chart data is validated before rendering. Values, labels, CSS inputs and exact-data tables share the same source values. Maximums must be positive, stacks must fit the declared maximum, negative observations need diverging bars and the area primitive requires six equally spaced points. Invalid data produces an explanation, never silent truncation or a misleading chart.

## Simulation Observatory

The [Observatory playground](../storybook/?path=/story/compositions-simulation-observatory--playground) exposes 26 arguments with grouped descriptions and conditional custom data/event editors. Three companion fixtures exercise shortage, missing values and scale boundaries. This is a composed quality reference: inspect selection, native event popovers, scroll progress and the decision dialog alongside the charts. These stories use a fixed 1366 × 900 desktop viewport so the Controls panel cannot shrink the preview into its unsupported-screen notice. Use the toolbar for themes, density, depth and zoom; open Canvas in a new tab for the full workspace. Argument changes dispose and remount its optional demo controller.

## Native HTML and class-based CSS

Styled dialogs use `rw-dialog` and documented child/modifier classes; see the [dialog class contract](DIALOG.md). Native invoker commands and dialog forms provide opening/closing without an application event handler. Native inputs, progress and details/summary preserve browser behavior. The optional policy helper requires native `requestClose()` and `closedBy`; it is not an older-browser polyfill.

Selection in a visual equipment/choice/dock story is controlled through args; these previews do not fabricate simulation logic. Behavior and time-series stories explicitly demonstrate optional JavaScript. Their documentation-only lifecycle hosts install a helper on connection and dispose it on disconnection. No custom elements are required by Runway UI.

## Develop and deploy

```sh
pnpm install --frozen-lockfile
pnpm run storybook
pnpm run build-site
pnpm check-docs
```

Story files are grouped by sidebar category under `stories/` (for example, `stories/foundations/` and `stories/game-patterns/`); shared argument metadata and escaping are in `stories/helpers.js`. Keep default CSF exports as object literals with a statically readable title and tags. Storybook's indexer does not execute metadata factory calls. The helper supplies runtime argument descriptions and defaults inside that object.

The Pages build writes only allowlisted public files to `.site/`, places Storybook under `/storybook/`, and renders Markdown guides to static HTML at build time. `main` pushes deploy through GitHub Actions. Generated output and local evidence are ignored.

Desktop browser observations remain scoped evidence, not cross-browser or accessibility certification.
