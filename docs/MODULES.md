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
| `styles/observatory.css` | `styles/observatory/`    | Workspace, resource ledger, context popover, decisions, responsive behavior                    |

Edit the component that owns the selector. The entry points contain imports only;
change them when adding a component or deliberately changing cascade order.
Accessibility files own cross-component reduced-motion and forced-color rules.
Each implementation declares its existing cascade layer, so splitting a file does
not change specificity or layer precedence. These are the only implementations;
there are no duplicate compatibility styles.

`styles/dialog.css` owns the dialog surface, backdrop, motion and modifiers in
the `runway-ui.dialog` layer. Its helper and declarations remain in `behaviors/`.
Other styles already have dedicated feature files. Keep behaviors and their type
declarations together in `behaviors/`, and examples in the corresponding
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

Optional loading behavior belongs in `behaviors/resource.ts`, stylesheet downloads in `behaviors/styles.ts`, and action dispatch in `behaviors/actions.ts`. Hosts own feature indexes, relative URL resolution and event listeners. See [loading and reuse](LOADING.md).

Behavior types are authored as JSDoc in the owning JavaScript module. Generate declarations with `bun run build-types`; verify source and consumer fixtures with `bun run check-types`. Do not edit `.d.ts` output. See [type ownership and the behavior map](TYPES.md).

## Storybook composition ownership

The welcome showcase lives in `stories/start-here/`. Its layout stylesheet is
imported by that story only; it assembles the real panel, button, badge, resource
and objective classes rather than duplicating their visual recipes. Keep
documentation layouts here and reusable component styles in `styles/`.

`styles/patterns.css` remains the compatible aggregate entry. Its component
imports retain the `runway-ui.patterns` layer and original cascade order;
`accessibility.css` owns shared dock and inventory motion preferences. Import
the aggregate for the complete patterns set, or choose component files through
`runway-ui/styles/patterns/*.css` alongside the base tokens and primitives.

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
aggregate. A standalone panel can import `runway-ui/styles/tokens.css` and
`runway-ui/styles/panels.css` without loading buttons, fields or game patterns.
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

## Optional React boundary

`react/` owns the optional React 19 / Base UI entry and generated declarations. It
may import React and Base UI primitive subpaths; vanilla runtime modules may not
import it. `stories/react/` owns example layout and React root teardown. See
[React usage](REACT.md). Do not duplicate upstream component state machines.
