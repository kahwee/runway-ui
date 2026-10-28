# Contributing

Small, focused improvements are welcome. Include the component, expected behavior and an example that demonstrates the change. Keep runtime dependencies at zero and avoid adding a framework requirement.
- Edit `styles/` and optional `behaviors/`; regenerate `dist/runway-ui.css` with `bun run build`.
- Give interactive controls accessible names, visible focus and native HTML semantics where possible.
- Keep `rw-` classes stable, theme through tokens and include teardown for browser behaviors.
- Check desktop examples at 1440 × 900 and 1366 × 768 for relevant visual changes. Do not hide features to fit a phone layout.
- Document browser requirements and distinguish observed checks from unverified claims.
- Do not add unrelated application rules, network services, analytics or proprietary artwork.

Contributions are provided under the project's MIT license. There is no separate contributor agreement or required on-screen attribution.

## Local validation

```sh
bun install --frozen-lockfile
bun run check
bun run check-boundaries
bun run test-boundaries
bun run test-dialog
bun run build
bun run build-site
bun run check-docs
bun pm pack --dry-run
```

`build-site` builds Storybook and the allowlisted static documentation; it does not deploy. Keep generated CSS in sync, check local documentation links, and inspect changed examples at both desktop sizes. Publishing packages, creating releases and changing hosting require an explicit request.

Document new public patterns in the component guides, shared-track example and argument-driven Storybook where applicable. Add capability and degradation notes to [MODERN-CSS.md](docs/MODERN-CSS.md) for picker, chart, disclosure or dialog enhancements. Preserve existing exports and percentage units unless documenting an intentional breaking migration in the changelog. Historical migration notes stay in the changelog; current recipes use `rw-` throughout.

After committing intended source and generated CSS changes, run `bun run check-generated`.
It rebuilds both the icon CSS and bundle and compares them to `HEAD`, so it is
expected to fail before those generated changes are committed. See
[source ownership and CI](docs/MODULES.md) and the [audit record](docs/AUDIT.md).

See [tooling and measurement limits](docs/TOOLING.md) for runtime compatibility and the migration checks.

## Native Bun checks

The `.bun-version` and `packageManager` fields pin Bun 1.4.4. Install with
`bun install --frozen-lockfile`. Use `bun lint` for module-boundary validation and
native `bun fmt --check`, and `bun check` for those checks plus generated
declaration verification and native behavior/consumer type checks. Bun does not
provide a built-in general-purpose lint command: `lint` is this project's script.
Use `bun fmt` or `bun run check-fix` to format authored source.

Internal type checks use `bun check --no-script` so they do not recursively call
the project's `check` script. Declaration emission still uses the TypeScript
compiler; Bun's native checker does not emit declaration files. Biome is not used.
Generated CSS, icon data and declarations are verified by their owning builders,
not reformatted in place. Structural/type/format checks do not replace browser
or accessibility review.

## Repository layout

- `styles/` and `behaviors/` contain the public library; `index.css` is its entry point and `dist/` holds generated CSS, runtime modules and declarations.
- `workshop/` contains assets for the root `index.html` demo.
- `stories/` groups Storybook stories by their sidebar category: `start-here/`, `foundations/`, `charts/`, `game-patterns/`, `behaviors/` and `compositions/`. Shared helpers stay at the top level. Use kebab-case filenames and preserve story titles and export names so existing story links keep working.
- `examples/` contains standalone compositions and their supporting assets.
- `docs/` contains guides and the documentation workbench; `scripts/` contains build tooling.
- `.storybook/` configures the component explorer. `storybook-static/` and `.site/` are generated and ignored.

## Behavior types

Author public types in the owning TypeScript module, then run `bun run build-types`, `bun run check-types` and `bun run test-behaviors`. Declarations are generated under ignored `dist/behaviors` and `dist/react` and included in built packages. Add positive and expected-error consumer examples when changing public contracts. `bun run check-generated` checks committed CSS after commit; type and package-export tests verify generated declarations. See [type generation](docs/TYPES.md).

## A useful first contribution

Start with one component and one reproducible problem. Improvements to copy,
keyboard behavior, long labels, dependency recipes and browser evidence are as
valuable as new components. The issue templates help describe a bug or proposal.

For a new primitive, add a minimal isolated recipe and its checks. For a composition,
reuse existing primitives and keep application-specific rules in the example.
Use the five-theme gallery to consider contrasting visual contexts, then check
relevant stories at both desktop sizes. Avoid claiming support from screenshots alone.

Run `bun run clean` when you need a fresh site build. It preserves committed
library assets and installed dependencies. See [build ownership](docs/TOOLING.md#build-ownership-and-cleanup).
