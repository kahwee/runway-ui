# Source ownership

Runway owns generic interface primitives. Application rules, action names and
feature adapters belong in consumers.

The public CSS entry points compose component files in a fixed order:

| Entry point              | Implementation directory | Ownership                                                                   |
| ------------------------ | ------------------------ | --------------------------------------------------------------------------- |
| `styles/fields.css`      | `styles/fields/`         | Base inputs, select picker, select variants, accessibility                  |
| `styles/forms.css`       | `styles/forms/`          | Switch, checkbox/radio, range, fields, choices, accessibility               |
| `styles/social.css`      | `styles/social/`         | Segmented control, avatar, person chip, leaderboard, accessibility, pace    |
| `styles/observatory.css` | `styles/observatory/`    | Workspace, resource ledger, context popover, decisions, responsive behavior |

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

Run `pnpm check`, `pnpm build` and `pnpm build-storybook` after changing styles.
The recursive build resolves the composition imports into the self-contained
`dist/runway-ui.css`. Never edit that generated bundle by hand. When resolving a
merge, resolve authored components first, then rebuild the bundle once. Commit
the bundle because GitHub archive consumers use it without a package build step.

Run `pnpm check-generated` to rebuild and verify both `dist/runway-ui.css` and
`styles/icons.css` against the current commit. The package CI job runs this on
pull requests and pushes to `main`; stale, missing or untracked generated files
fail with instructions to rebuild and commit them. The command regenerates the
working copies, so commit intentional source and generated changes together
before checking locally.

## Automated boundary checks

Run `pnpm check-boundaries` before committing a module change. It checks authored
JavaScript, TypeScript and CSS dependencies for missing local targets and circular
imports, including re-exports and literal dynamic imports. Runtime behaviors may
import other behaviors only, with no external runtime dependencies. Component
styles may import other styles; `index.css` is the public composition entry point.
Library implementation modules must not depend on stories, examples, build scripts
or application entry points.

Runway has no application action registry. Duplicate protection therefore checks
object keys (including handler maps) and public behavior export names across
runtime entry modules. It does not treat repeated `data-action` attributes in
independent examples as conflicting registrations. `pnpm test-boundaries` exercises
the checker with valid and invalid fixtures so enforcement changes are checked too.

The Package GitHub Actions workflow runs lint, boundary checks/tests and package
build verification as independent jobs on pull requests and pushes to `main`.
Pull requests also build Storybook and the documentation site in parallel, then
run `pnpm check-docs` to verify generated local links, anchors and assets. On `main`, the existing Pages
workflow builds Storybook and checks documentation links before deployment. New
commits cancel superseded Package runs for the same branch or pull request.
These jobs report check results; repository branch-protection settings determine
whether GitHub requires those checks before a merge.

Optional loading behavior belongs in `behaviors/resource.js`, stylesheet downloads in `behaviors/styles.js`, and action dispatch in `behaviors/actions.js`. Hosts own feature indexes, relative URL resolution and event listeners. See [loading and reuse](LOADING.md).

Behavior types are authored as JSDoc in the owning JavaScript module. Generate declarations with `pnpm build-types`; verify source and consumer fixtures with `pnpm check-types`. Do not edit `.d.ts` output. See [type ownership and the behavior map](TYPES.md).
