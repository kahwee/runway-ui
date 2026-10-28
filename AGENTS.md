# Runway UI

Runway is a React component library with standalone CSS for generic management
and simulation games. Optimize for clear APIs, readable game state, keyboard and
touch input, predictable rendering, and components that remain usable in long
sessions. Simulation rules, persistence, networking and consumer adapters belong
in applications.

## Source ownership

Read [docs/MODULES.md](docs/MODULES.md) before moving modules or changing imports.

- `react/index.ts` is an export-only public facade. Each component and its props
  live in the named owner (`button.ts`, `meter.ts`, `command-bar.ts`, etc.). Import
  owners directly inside the library; never import the facade from an owner.
  Keep closely related pieces together, such as `Dossier` and `DossierList`.
- TanStack Charts is the sole plotting engine, including sparklines and example histories. Do not reintroduce CSS plot geometry or custom SVG chart renderers. Keep exact data/units available as semantic HTML.
- React 19, Base UI and `@tanstack/charts` are required peers. Use Base UI primitive
  subpaths and TanStack Charts; preserve upstream refs, props, state-dependent
  classes and accessibility. Do not duplicate their interaction state machines.
- `behaviors/` contains the remaining vanilla compatibility modules. Add no new
  features there. It must not import React, peers, application code or tooling.
- CSS aggregates compose owners in a fixed order. Edit `styles/<feature>/` for
  charts, instruments, feedback, forms, fields, patterns and themed compositions.
  An aggregate must contain imports only. Foundation styles must not import
  composition styles. Keep CSS independent of JavaScript.
- Game input is opt-in and local to the focused scope. Preserve native editing,
  Tab, nested-scope ownership and native modal decisions. Stop controller polling
  on lost focus, hidden documents, opt-out and unmount; test synthetic mappings
  without claiming physical-device validation. See [docs/GAME-INPUT.md](docs/GAME-INPUT.md).
- Stories and examples compose real library components. Reusable recipes belong
  in `react/` or `styles/`; demo content and application state belong in examples.
- Tooling policy lives in `scripts/boundaries/`; generated-file synchronization
  lives in `scripts/lib/`. Keep parsing, dependency policy and output ownership
  separate. Extend checker fixtures when changing enforcement.

## Component quality

- Preserve public exports, props and `rw-` classes. Record intentional breaking
  changes, including DOM contracts, in [docs/CHANGELOG.md](docs/CHANGELOG.md).
- Prefer small composable APIs. Keep ordinary consumer props and refs available;
  support controlled values where application state owns a control. Use stable
  item IDs rather than array positions for remembered identity.
- Every interactive control needs a native label or accessible name, visible
  focus, meaningful disabled behavior, and reachable actions. Announced values
  must agree with displayed state. Avoid adding live announcements to frequent
  simulation updates without a clear need.
- Use native HTML dialog focus, modality and inertness. Preserve Escape/cancel
  vetoes for required decisions. Follow [docs/DIALOG.md](docs/DIALOG.md); newer
  dismissal APIs are optional and compatibility stays local to the helper.
- Keep render functions pure and safe for server rendering. Clean up listeners,
  timers, animation frames and React roots. Reduced motion and forced colors
  must retain meaning and usable controls.
- Demonstrate meaningful states in argument-driven Storybook: ordinary use,
  disabled/empty data, long content, keyboard interaction and narrow layouts as
  applicable. Regression tests should protect Runway behavior and boundaries;
  do not duplicate upstream React, Base UI or TanStack correctness/interop tests.

## CSS and responsive behavior

Use native nesting, logical properties, cascade layers, container queries and
perceptual color mixing. Use subgrid for shared alignment instead of duplicated
track definitions or fixed-height tricks. Preserve selector order and layers
when extracting modules; verify the rendered result after rebuilding.

Check relevant UI at 1440 × 900, 1366 × 768, 768px tablet, 390px and 320px.
Keep data and actions available at every size; use named keyboard-accessible
scroll regions when needed. Never replace a narrow layout with a viewport gate.
Add new shared layouts to the shared-track example and Storybook playground.
Document capability/degradation behavior for picker, chart, disclosure and dialog
enhancements in [docs/MODERN-CSS.md](docs/MODERN-CSS.md).

## Builds and validation

Use pinned Bun and `bun.lock`; do not add competing lockfiles or reintroduce
Biome. All authored modules are TypeScript/TSX. Format with `bun fmt` (or
`bun run check-fix`); review any behavior changes separately.

- Run `bun run check` for source policy, boundaries, formatting, declarations,
  type checks and the dependency guide. Regenerate that guide with
  `bun run build-dependency-map` when CSS import ownership changes.
- Run `bun run test-boundaries` for architecture changes, `bun run test-dialog`
  for dialog policy, and `bun run test-behaviors` for runtime, React or build
  changes. Public API changes also need consumer type fixtures.
- Run `bun run build` to generate JavaScript, declarations, icons and bundled CSS.
  Never hand-edit generated `.js`, `.d.ts`, `styles/icons.css` or
  `dist/runway-ui.css`. Each generator removes only its own retired file types;
  failed compilation must preserve the last successful output.
- Use the production busy-screen fixture and `bun run bench-game-ui` for runtime
  performance comparisons. Keep raw timing/environment data local and use
  documented reference budgets; do not claim speedups from structural checks.
- For stylesheet or story changes, build Storybook with `bun run build-storybook`
  and inspect affected desktop and responsive states. `bun run build-site`,
  `bun run check-docs` and `bun run check-pages` validate publication artifacts.
- Commit source and generated CSS together. Run `bun run check-generated` after
  committing: it rebuilds and compares committed CSS against `HEAD`.

Inspect the working tree before editing and preserve concurrent work. Use an
isolated worktree if another task is changing the same owners. Distinguish local
checks, commits, pushes, deployment and verified live behavior in reports.

After completing requested work, stage all nonignored workspace changes, commit,
pull `origin/main` with rebase, and push to `main` by default unless the user
explicitly limits the scope. Review the staged diff and finish required checks
before pushing; do not include secrets or ignored local evidence.

## Distribution and environments

Keep public code, documentation and examples generic. Include no private projects,
consumer-specific adapters, local machine paths or secret values. MIT is the sole
license for original material; preserve `LICENSE` in package archives and
redistributions, with no attribution-in-UI requirement.

Prefer available 1Password Environments tools for developer-environment metadata
and authorized mounts. Preserve native authorization prompts and obtain explicit
confirmation before creating or expanding persistent access. Never put secret
values in chat, logs or committed files.

Follow [docs/RELEASING.md](docs/RELEASING.md). Do not change versions, publish npm
packages, create releases or change hosting unless requested. A main-branch push,
a Pages deployment and npm publication are separate outcomes.
