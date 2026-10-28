# Runway UI

- Component ownership and cascade composition: [docs/MODULES.md](docs/MODULES.md). Edit the owning component; rebuild generated CSS after resolving source merges.

- Framework-independent HTML/CSS library for generic management and simulation interfaces.
- Keep vanilla runtime dependencies at zero. The explicitly optional `runway-ui/react` entry may use React 19 and Base UI peers; keep it isolated from vanilla imports. Browser behaviors are optional ES modules with TypeScript declarations and explicit teardown.
- For current dialog/browser requirements, follow [docs/DIALOG.md](docs/DIALOG.md). `bindDialog` requires native `showModal()` and `close()`; newer dismissal APIs are optional. Keep compatibility handling local to the helper, preserve cancel vetoes and required decisions, and leave focus/inertness native. Record breaking changes in [docs/CHANGELOG.md](docs/CHANGELOG.md).
- Use native HTML dialog behavior and browser focus/inertness. Preserve Escape/cancel guards for required decisions.
- Use modern CSS: cascade layers, subgrid for aligned production rows, container queries for panel layout, logical properties, reduced-motion and forced-color support.
- Preserve the rw- class vocabulary and existing exports unless documenting an intentional breaking change.
- Check desktop UI at 1440 × 900 and 1366 × 768, and responsive examples at 320px, 390px and tablet widths. Keep data and actions available on narrow screens; do not restore desktop-only gates.
- Keep all public material generic. Do not include private projects, personal naming discussions, local machine paths or consumer-specific adapters.
- MIT is the only license for original code, styles, documentation and examples. Keep LICENSE in redistributions and package archives. Do not add attribution-in-UI requirements.
- Build the self-contained CSS with bun run build. Do not publish npm packages, create releases or change hosting unless requested.

## CSS direction

- Modern CSS is the baseline: use native nesting, logical sizing, cascade layers, container queries and perceptual color mixing.
- Use subgrid when children need shared parent alignment. Prefer the documented form, card, stat and choice layouts over duplicated track sizes or fixed-height alignment.
- Add new layout patterns to the shared-track example and argument-driven Storybook playground. Keep native labels, controls and semantic wrappers.
- Newer picker, chart, disclosure and dialog enhancements must have explicit capability/degradation notes in docs/MODERN-CSS.md. Prefer native CSS behavior to extra layout JavaScript.

## Naming

- Use kebab-case for new file and directory names, CSS classes, HTML IDs, data-attribute names, and package script names. Keep the `rw-` prefix for shared library classes and tokens.
- Preserve existing public names and exports unless an intentional migration is documented. JavaScript/TypeScript identifiers follow camelCase/PascalCase and Rust identifiers follow Rust conventions; the kebab-case rule applies to paths and web-facing names.

## Tooling

- Use the pinned Bun version and `bun.lock`; do not add competing npm, pnpm or Yarn lockfiles.
- Validate imports with `bun run check-boundaries`, checker fixtures with `bun run test-boundaries`, and dialog policy with `bun run test-dialog`. Rebuild CSS before committing; run `bun run check-generated` after committing, since it compares against `HEAD`.
- All authored modules use TypeScript/TSX. Behavior and React declarations are generated from strict TypeScript into `dist/`; never edit generated `.js` or `.d.ts` by hand. Run `bun run build-types`, `bun run check-types` and `bun run test-behaviors` for behavior changes. See [docs/TYPES.md](docs/TYPES.md).
- Run `bun run check` before committing. Use `bun run check-fix` for safe lint fixes and formatting; review any behavior changes before applying unsafe fixes.
- Release steps and publication boundaries: [docs/RELEASING.md](docs/RELEASING.md). Source archives need `bun run build` to generate runtime JavaScript; a main/Pages deployment is not npm publication.
- `bun lint` runs the authored-TypeScript guard, module-boundary validation and Bun native format checks. `bun check` runs those checks plus declaration verification and Bun native type checks. Use `bun fmt` to format authored TypeScript, JSON, CSS and HTML; generated artifacts are verified by their owning builders. Do not reintroduce Biome.
