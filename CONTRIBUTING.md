# Contributing

Small, focused improvements are welcome. Include the component, expected behavior and an example that demonstrates the change. Keep runtime dependencies at zero and avoid adding a framework requirement.
- Edit `styles/` and optional `behaviors/`; regenerate `dist/runway-ui.css` with `pnpm run build`.
- Give interactive controls accessible names, visible focus and native HTML semantics where possible.
- Keep `rw-` classes stable, theme through tokens and include teardown for browser behaviors.
- Check desktop examples at 1440 × 900 and 1366 × 768 for relevant visual changes. Do not hide features to fit a phone layout.
- Document browser requirements and distinguish observed checks from unverified claims.
- Do not add unrelated application rules, network services, analytics or proprietary artwork.

Contributions are provided under the project's MIT license. There is no separate contributor agreement or required on-screen attribution.

## Local validation

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm check-boundaries
pnpm test-boundaries
pnpm test-dialog
pnpm run build
pnpm run build-site
pnpm check-docs
pnpm pack --dry-run
```

`build-site` builds Storybook and the allowlisted static documentation; it does not deploy. Keep generated CSS in sync, check local documentation links, and inspect changed examples at both desktop sizes. Publishing packages, creating releases and changing hosting require an explicit request.

Document new public patterns in the component guides, shared-track example and argument-driven Storybook where applicable. Add capability and degradation notes to [MODERN-CSS.md](docs/MODERN-CSS.md) for picker, chart, disclosure or dialog enhancements. Preserve existing exports and percentage units unless documenting an intentional breaking migration in the changelog. Historical migration notes stay in the changelog; current recipes use `rw-` throughout.

After committing intended source and generated CSS changes, run `pnpm check-generated`.
It rebuilds both the icon CSS and bundle and compares them to `HEAD`, so it is
expected to fail before those generated changes are committed. See
[source ownership and CI](docs/MODULES.md) and the [audit record](docs/AUDIT.md).

## Biome and pnpm

The `packageManager` field pins pnpm; install that version before running the frozen-lockfile setup above. Use `pnpm check`, `pnpm check-fix`, `pnpm format` and `pnpm lint`. Biome is a development dependency only. Generated CSS, generated icon data, Storybook output and the static site are excluded; rebuild them from formatted sources.

The recommended rule preset remains enabled. The configuration allows intentional cascade specificity and essential `!important` visibility/motion guards. Narrow overrides preserve the existing ARIA table/grid demonstrations and the newer `selectedcontent` selector, which Biome does not yet recognize. List roles remain explicit where CSS marker removal otherwise affects list semantics. These exceptions do not replace browser or accessibility review. HTML formatting uses Biome's experimental full-document support.

## Repository layout

- `styles/` and `behaviors/` contain the public library; `index.css` is its entry point and `dist/` holds generated CSS.
- `workshop/` contains assets for the root `index.html` demo.
- `stories/` groups Storybook stories by their sidebar category: `start-here/`, `foundations/`, `charts/`, `game-patterns/`, `behaviors/` and `compositions/`. Shared helpers stay at the top level. Use kebab-case filenames and preserve story titles and export names so existing story links keep working.
- `examples/` contains standalone compositions and their supporting assets.
- `docs/` contains guides and the documentation workbench; `scripts/` contains build tooling.
- `.storybook/` configures the component explorer. `storybook-static/` and `.site/` are generated and ignored.
