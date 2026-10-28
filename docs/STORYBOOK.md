# Argument-driven HTML Storybook

[Open the explorer](https://kahwee.github.io/runway-ui/storybook/). It uses Storybook 10's HTML renderer: ordinary HTML/CSS rather than framework component wrappers. Storybook and its manager are development tools, not library runtime dependencies.

## Start with a small win

The welcome canvas offers a three-step tour: build a first panel, explore the six
themes, then read the implementation guides. Its empty Controls panel stays hidden;
component playgrounds retain their controls. The manager uses the Studio palette
and bundled Nunito font.

Open the [Recipe book](../storybook/?path=/story/start-here-recipe-book--playground)
for a mission card, resource HUD or native dialog. Change the recipe, heading and
action label in Controls; inspect or copy the current HTML beside the live sample.
Copy reports success or points to the selectable source when clipboard access is
unavailable. Local actions explain their preview-only effects. The native dialog
starts on the safe action, supports Escape and restores focus to its invoker.
Each recipe links to its matching contract and the dependency guide.

The responsive workshop links directly to Storybook, first-panel recipes and the
guides, so visitors can explore the same material on phones and desktops.

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

The [Observatory playground](../storybook/?path=/story/compositions-simulation-observatory--playground) exposes 26 arguments with grouped descriptions and conditional custom data/event editors. Three companion fixtures exercise shortage, missing values and scale boundaries. This is a composed quality reference: inspect selection, native event popovers, scroll progress and the decision dialog alongside the charts. These stories adapt to the actual canvas width, including an open Controls panel. Use the toolbar for themes, density, depth and zoom; open Canvas in a new tab for the full workspace. Argument changes dispose and remount its optional demo controller.

## Native HTML and class-based CSS

Styled dialogs use `rw-dialog` and documented child/modifier classes; see the [dialog class contract](DIALOG.md). Native invoker commands and dialog forms provide opening/closing without an application event handler. Native inputs, progress and details/summary preserve browser behavior. The optional policy helper requires native `showModal()` and `close()`. Missing `requestClose()` or `closedBy` use local guarded dismissal handling; focus and inertness remain native. See [compatibility details](DIALOG.md).

Selection in a visual equipment/choice/dock story is controlled through args; these previews do not fabricate simulation logic. Behavior and time-series stories explicitly demonstrate optional JavaScript. Their documentation-only lifecycle hosts install a helper on connection and dispose it on disconnection. No custom elements are required by Runway UI.

## Develop and deploy

```sh
bun install --frozen-lockfile
bun run storybook
bun run build-site
bun run check-docs
bunx --no-install playwright install chromium
bun run check-pages
```

Story files are grouped by sidebar category under `stories/` (for example, `stories/foundations/` and `stories/game-patterns/`); shared argument metadata and escaping are in `stories/helpers.ts`. Keep default CSF exports as object literals with a statically readable title and tags. Storybook's indexer does not execute metadata factory calls. The helper supplies runtime argument descriptions and defaults inside that object.

The Pages build writes only allowlisted public files to `.site/`, places Storybook under `/storybook/`, and renders Markdown guides to static HTML at build time. `main` pushes deploy through GitHub Actions. Generated output and local evidence are ignored.

`check-docs` validates local links, assets, anchors and Storybook entry routes
throughout the published HTML. `check-pages` serves the exact `.site` artifact
under `/runway-ui/` with real 404 responses. It checks phone and desktop layouts,
recipe actions and copy feedback, native dialog focus and
Escape, manager navigation, live Controls, and failed assets/browser errors.
Screenshots go to `.local/pages-check/`. Pages and pull-request workflows run it
before publication. To check the live deployment, run:

```sh
bun run check-pages https://kahwee.github.io/runway-ui/
```

These Chromium observations remain scoped evidence, not cross-browser or
accessibility certification.

## Isolated dependency checks

Open **Isolation / Controls** for examples rendered in separate iframe documents.
Unlike regular stories, these cannot inherit the full library stylesheet from
the preview. Toolbar themes, density and material intentionally do not apply.
- **Standalone controls** loads only `styles/tokens.css` and `styles/controls.css`.
  It checks pressed versus unpressed colors and keyboard shortcut styling.
- **Dock composition** adds `styles/patterns/dock.css` and
  `styles/patterns/accessibility.css` for layout and reduced-motion preferences.

The story imports CSS as Vite inline strings, so the same isolated documents work
in development and the built Storybook without external asset paths. Each story
has a play check that inspects computed styles inside its frame and fails when
required control, shortcut or dock styles are missing. Successful checks mark the
frame with `data-verified="true"`. The iframe helper is documentation tooling only;
consumers use ordinary HTML and CSS imports.

## Component dependency fixtures

**Isolation / Components** adds fields, form controls, view navigation, section
navigation and CSS charts to the existing control and panel fixtures. Native
editing, switch toggling, form values and link navigation are checked alongside
computed styles and chart geometry. Checkbox masks explicitly require icons.

The [dependency map](DEPENDENCIES.md) is generated from the same recipe definitions
used by the stories. Run `bun run build-dependency-map` after changing a recipe or
its CSS imports, and `bun run check-dependency-map` to detect drift. The isolated
frames use only their declared CSS; toolbar theme settings intentionally do not
apply. Optional behavior modules and application responsibilities are documented
per recipe.

## Responsive visual checks

Build and serve `storybook-static`, then run the explicit browser review tool:

```sh
bun scripts/check-storybook-layout.ts http://127.0.0.1:6006
```

This uses a separately installed `agent-browser`; it is not a package or CI
runtime dependency. The tool discovers stories from `index.json`, captures
320/390/1366/1440px screenshots and checks page overflow, isolated recipe play
checks, keyboard-accessible data scroll regions and open dialog actions. Review
the screenshots as well as the measurements; geometry checks cannot judge design
quality or replace a complete accessibility audit.

Preview gutters and sample grids adapt to narrow canvases. Wide comparison and
production tables retain their columns inside named, focusable scroll regions;
illustrated navigation wraps. The Observatory keeps its charts, resource selection and review actions available on phones. Nested UI scopes follow
the toolbar unless the specimen explicitly declares its own theme. Isolated
frames deliberately keep their own tokens and imports.
## Story quality

Start with **Theme playground**, an argument-driven composition for light Studio,
dark Orbital and black Midnight. Content, width, status, elevation, progress and
disabled state are controls; theme, density, material and depth remain global.
The old static Many worlds gallery was removed. Desk workspace's duplicate Quiet
story was removed; use its `quiet` argument instead. Stress fixtures and isolated
import checks remain because they verify distinct failure cases.

The default preview uses Studio and classic material. This avoids imposing the
Play skin on every theme. Light and dark appearances are explicit theme choices,
not automatic OS color-scheme overrides. Paper studio intentionally retains its
paper palette; isolated fixtures intentionally use their declared base tokens.

The public examples have a companion browser check. Serve the built `.site/` and
run `bun scripts/check-responsive-examples.ts http://127.0.0.1:6011`. It checks
phone, tablet and desktop page bounds, confirms that the content remains available,
and exercises mobile resource selection and the preview-only review flow.
