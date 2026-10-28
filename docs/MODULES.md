# Source ownership

Runway owns generic interface primitives. Application rules, action names and
feature adapters belong in consumers.

The public CSS entry points compose component files in a fixed order:

| Entry point              | Implementation directory | Ownership                                                                                      |
| ------------------------ | ------------------------ | ---------------------------------------------------------------------------------------------- |
| `styles/patterns.css`    | `styles/patterns/`       | Resources, inventory slots, choices, objectives, dock, view tabs, section tabs, reduced motion |
| `styles/fields.css`      | `styles/fields/`         | Base inputs, select picker, select variants, accessibility                                     |
| `styles/forms.css`       | `styles/forms/`          | Switch, checkbox/radio, range, fields, choices, accessibility                                  |
| `styles/social.css`      | `styles/social/`         | Segmented control, avatar, person chip, leaderboard, accessibility, pace                       |
| `styles/cozy.css`        | `styles/cozy/`           | Cozy theme tokens, controls, surfaces, badges, meters, patterns, desk workspace, charts, dialog, accessibility |
| `styles/charts.css` | `styles/charts/` | Frames, columns, series, area, data tables, density, responsive behavior and forced colors |
| `styles/instruments.css` | `styles/instruments/` | Console, range and line history, impact, appearance, timeline, responsive behavior and forced colors |
| `styles/feedback.css` | `styles/feedback/` | Animated numbers, toast surfaces, confetti, keyframes and reduced motion |
| `styles/observatory.css` | `styles/observatory/`    | Workspace, resource ledger, context popover, decisions, responsive behavior                    |

Edit the component that owns the selector. The entry points contain imports only;
change them when adding a component or deliberately changing cascade order.
Accessibility files own cross-component reduced-motion and forced-color rules.
Each implementation declares its existing cascade layer, so splitting a file does
not change specificity or layer precedence. These are the only implementations;
there are no duplicate compatibility styles.

`styles/dialog.css` owns the dialog surface, backdrop, motion and modifiers in
the `runway-ui.dialog` layer. Its TypeScript helper remains in `behaviors/`; declarations compile to `dist/behaviors/`.
Other styles already have dedicated feature files. Keep behavior implementations and their public types together in `behaviors/`, and examples in the corresponding
Storybook feature. A new variant of an existing component belongs with that
component, without changes to `index.css` or the package exports.

Run `bun run check`, `bun run build` and `bun run build-storybook` after changing styles.
The recursive build resolves the composition imports into the self-contained
`dist/runway-ui.css`. Never edit that generated bundle by hand. When resolving a
merge, resolve authored components first, then rebuild the bundle once. Commit
the bundle because GitHub archive consumers use it without a package build step.

Run `bun run check-generated` to rebuild and verify both `dist/runway-ui.css` and
`styles/icons.css` against the current commit. The package CI job runs this on
pull requests and pushes to `main`; stale, missing or untracked generated files
fail with instructions to rebuild and commit them. The command regenerates the
working copies, so commit intentional source and generated changes together
before checking locally.

## Automated boundary checks

Run `bun run check-boundaries` before committing a module change. It checks authored
JavaScript, TypeScript and CSS dependencies for missing local targets and circular
imports, including re-exports and literal dynamic imports. Runtime behaviors may
import other behaviors only, with no external runtime dependencies. Component
styles may import other styles; `index.css` is the public composition entry point.
Library implementation modules must not depend on stories, examples, build scripts
or application entry points.

Runway has no application action registry. Duplicate protection therefore checks
object keys (including handler maps) and public behavior export names across
runtime entry modules. It does not treat repeated `data-action` attributes in
independent examples as conflicting registrations. `bun run test-boundaries` exercises
the checker with valid and invalid fixtures so enforcement changes are checked too.

The Package GitHub Actions workflow runs lint, boundary checks/tests and package
build verification as independent jobs on pull requests and pushes to `main`.
Pull requests also build Storybook and the documentation site in parallel, then
run `bun run check-docs` to verify generated local links, anchors and assets. On `main`, the existing Pages
workflow builds Storybook and checks documentation links before deployment. New
commits cancel superseded Package runs for the same branch or pull request.
These jobs report check results; repository branch-protection settings determine
whether GitHub requires those checks before a merge.

Behavior types are authored in the owning TypeScript module. Generate declarations with `bun run build-types`; verify source and consumer fixtures with `bun run check-types`. Do not edit `.d.ts` output. See [type ownership and the behavior map](TYPES.md).

## Storybook composition ownership

The welcome showcase lives in `stories/start-here/`. Its layout stylesheet is
imported by that story only; it assembles the real panel, button, badge, resource
and objective classes rather than duplicating their visual recipes. Keep
documentation layouts here and reusable component styles in `styles/`.

`styles/patterns.css` remains the compatible aggregate entry. Its component
imports retain the `runway-ui.patterns` layer and original cascade order;
`accessibility.css` owns shared dock and inventory motion preferences. Import
the aggregate for the complete patterns set, or choose component files through
`@kahwee/runway-ui/styles/patterns/*.css` alongside the base tokens and primitives.

## Controls own their shared states

`styles/controls.css` owns button pressed-state colors and `rw-shortcut`, including
when controls are used outside a dock. `styles/patterns/dock.css` owns only the
dock surface, button arrangement and dock-specific animations. Its animation
preferences remain in `styles/patterns/accessibility.css`. Neither shared control
recipe requires importing game patterns.

## Primitives and compositions

Primitives own reusable recipes: `controls.css` owns buttons and shortcuts,
`fields.css` / `forms.css` own native form controls, and `panels.css` owns the
panel surface, header, title and elevation. `primitives.css` remains the compatible
aggregate. A standalone panel can import `@kahwee/runway-ui/styles/tokens.css` and
`@kahwee/runway-ui/styles/panels.css` without loading buttons, fields or game patterns.
The boundary checker rejects imports from these foundational modules into
composition styles, including imports from their implementation directories.

Composition entry points retain their names, layers and import order:

| Entry                              | Component ownership                                                                                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `styles/workspace.css`             | `workspace/command-bar.css`, `folio-tabs.css`, `sheet.css`, `dossier.css`, `control-console.css`, `accessibility.css`                        |
| `styles/studio.css`                | Paper command bar, navigation, surfaces, season cover, leaderboard, viewport responsiveness, accessibility and container layout in `studio/` |
| `styles/observatory/workspace.css` | Shell and identity, metric tiles, panel placement and content, footer in `observatory/workspace/`                                            |

Compositions may arrange or apply scoped appearances to primitives; a primitive
must never import a composition to finish its appearance. Studio appearances
remain scoped to `rw-paper-*`; observatory placement rules remain scoped to
`rw-observatory*`. Neither redefines an unscoped button, field or panel recipe.
Use **Isolation / Panels** in Storybook to verify the independent panel entry.

## React component ownership

`react/index.ts` is the public, export-only facade. Named component owners contain
implementation and props together; no owner imports the facade. Internal files
are not additional package entry points. Consumers keep importing
`@kahwee/runway-ui/react`. The client boundary remains explicit in component
modules. Do not duplicate upstream component state machines.

| Owner | Responsibility |
| --- | --- |
| `root.ts` | Theme and density root |
| `button.ts`, `input.ts` | Styled Base UI primitives; preserve upstream refs and state-dependent classes |
| `progress.ts`, `meter.ts` | Native progress and labelled bounded meter |
| `panel.ts`, `badge.ts`, `resource.ts` | Surfaces, status and resource readouts |
| `command-bar.ts`, `control-console.ts` | Workspace status and workflow controls |
| `folio-tabs.ts`, `sheet.ts` | Section navigation and paper sections |
| `dossier.ts` | Dossier and its aligned list; these share one component contract |
| `animated-number.ts`, `confetti.ts`, `reduced-motion.ts` | Value animation, celebrations and shared motion preference |
| `toast.ts` | Base UI toast provider, stack and hook |
| `dialog.ts`, `inventory.ts`, `range.ts` | Native modal policy, roving slot focus and slider state |
| `chart.ts` | TanStack Charts exports and chart card |
| `classes.ts` | Plain and state-dependent class composition |

React owners may import other owners and the approved React, Base UI and TanStack
peers. They cannot import vanilla behaviors, styles, stories or tooling. Vanilla
behaviors and CSS cannot depend on React. `stories/react/` owns example state,
layout and React root teardown. See [React usage](REACT.md).

## Tooling ownership

`scripts/check-boundaries.ts` coordinates parsing, import validation, cycle
checks and public behavior export checks. `scripts/boundaries/source-files.ts`
owns source inventory; `policy.ts` owns dependency and aggregate rules. The
checker rejects component implementations in the React facade, imports of that
facade from owners, and declarations inside import-only CSS aggregates. Fixtures
exercise permitted and forbidden dependencies.

`scripts/lib/generated-files.ts` synchronizes one generated file type within one
output directory. Runtime compilation owns `.js`; declaration compilation owns
`.d.ts`. Both compile before synchronizing and remove retired output only after
successful compilation. Concurrent generators never delete one another's file
types. Declaration check mode detects stale or retired files without writing.
Nested source owners retain their relative paths in generated output.

`dist/behaviors` and `dist/react` are disposable package outputs. `dist/runway-ui.css`
and `styles/icons.css` remain committed assets. A rebuild must not ship deleted
features merely because their old generated files exist locally. See
[build ownership](TOOLING.md#build-ownership-and-cleanup).
