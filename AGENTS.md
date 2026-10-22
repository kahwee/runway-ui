# Runway UI

- Component ownership and cascade composition: [docs/MODULES.md](docs/MODULES.md). Edit the owning component; rebuild generated CSS after resolving source merges.

- Framework-independent HTML/CSS library for generic management and simulation interfaces.
- Keep runtime dependencies at zero. Browser behaviors are optional ES modules with TypeScript declarations and explicit teardown.
- For current dialog/browser requirements, follow [docs/DIALOG.md](docs/DIALOG.md); `bindDialog` requires native `requestClose()` and `closedBy`, with no emulation. Record breaking changes in [docs/CHANGELOG.md](docs/CHANGELOG.md).
- Use native HTML dialog behavior and browser focus/inertness. Preserve Escape/cancel guards for required decisions.
- Use modern CSS: cascade layers, subgrid for aligned production rows, container queries for panel layout, logical properties, reduced-motion and forced-color support.
- Preserve the rw- class vocabulary and existing exports unless documenting an intentional breaking change.
- Desktop examples target 1100 × 640 minimum. Check relevant UI changes at 1440 × 900 and 1366 × 768. Narrow screens show an unsupported notice.
- Keep all public material generic. Do not include private projects, personal naming discussions, local machine paths or consumer-specific adapters.
- MIT is the only license for original code, styles, documentation and examples. Keep LICENSE in redistributions and package archives. Do not add attribution-in-UI requirements.
- Build the self-contained CSS with pnpm run build. Do not publish npm packages, create releases or change hosting unless requested.

## CSS direction

- Modern CSS is the baseline: use native nesting, logical sizing, cascade layers, container queries and perceptual color mixing.
- Use subgrid when children need shared parent alignment. Prefer the documented form, card, stat and choice layouts over duplicated track sizes or fixed-height alignment.
- Add new layout patterns to the shared-track example and argument-driven Storybook playground. Keep native labels, controls and semantic wrappers.
- Newer picker, chart, disclosure and dialog enhancements must have explicit capability/degradation notes in docs/MODERN-CSS.md. Prefer native CSS behavior to extra layout JavaScript.

## Naming

- Use kebab-case for new file and directory names, CSS classes, HTML IDs, data-attribute names, and package script names. Keep the `rw-` prefix for shared library classes and tokens.
- Preserve existing public names and exports unless an intentional migration is documented. JavaScript/TypeScript identifiers follow camelCase/PascalCase and Rust identifiers follow Rust conventions; the kebab-case rule applies to paths and web-facing names.

## Tooling

- Use the pinned pnpm version and `pnpm-lock.yaml`; do not add npm or Yarn lockfiles.
- Validate imports with `pnpm check-boundaries`, checker fixtures with `pnpm test-boundaries`, and dialog policy with `pnpm test-dialog`. Rebuild CSS before committing; run `pnpm check-generated` after committing, since it compares against `HEAD`.
- Run `pnpm check` before committing. Use `pnpm check-fix` for safe lint fixes and formatting; review any behavior changes before applying unsafe fixes.
- Biome covers authored JavaScript, TypeScript declarations, JSON, CSS and HTML. Keep generated bundles, generated icons, dependency trees and build output outside its scope.
