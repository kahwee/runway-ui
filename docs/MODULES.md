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

Other styles already have dedicated feature files. Keep behaviors and their type
declarations together in `behaviors/`, and examples in the corresponding
Storybook feature. A new variant of an existing component belongs with that
component, without changes to `index.css` or the package exports.

Run `pnpm check`, `pnpm build` and `pnpm build-storybook` after changing styles.
The recursive build resolves the composition imports into the self-contained
`dist/runway-ui.css`. Never edit that generated bundle by hand. When resolving a
merge, resolve authored components first, then rebuild the bundle once. Commit
the bundle because GitHub archive consumers use it without a package build step.
