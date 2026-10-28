# Development tooling

Use Bun 1.4.4, pinned in `.bun-version` and `package.json`, with the committed
`bun.lock`. Run `bun install --frozen-lockfile`; CI uses the same pin and frozen
install. Node 22.18+ or 24.11+ remains available for third-party CLI programs,
including Storybook. The CSS and optional browser behaviors require no runtime
package dependencies.

```sh
bun lint
bun check
bun run check-boundaries
bun run test-boundaries
bun run test-dialog
bun run check-types
bun run test-behaviors
bun run build-site
bun run check-docs
bun run check-generated
bun pm pack --dry-run
```

The existing tests still import `node:test`. Bun's compatibility is partial;
this repository checks the exact discovered tests rather than assuming that all
Node runner features are supported. Keep explicit file selection in package
scripts when adding tests. See [Bun's Node compatibility documentation](https://bun.sh/docs/runtime/nodejs-compat).

The lockfile migration preserves resolved dependency versions and integrity
hashes for all 242 application dependencies; the 15 obsolete pnpm runtime/platform
packages are omitted. Only esbuild retains lifecycle-script trust, matching the previous
configuration. The existing Vite release-age exception remains in `bunfig.toml`; obsolete Biome exceptions are removed. No new exceptions are introduced. Do not broaden dependency trust
to repair a failing install.

Generated CSS, icons and declarations remain byte-identical across the migration.
The existing declaration provenance header is deliberately retained to avoid
changing public artifacts solely for tooling. Declarations must still be
regenerated from source, not edited by hand.

## Measurement limits

On one Linux x86-64 development environment, four serial process runs compared
Node 24.19.0 with Bun 1.4.4. The median of the final three runs changed from
2.14s to 1.39s for the complete declaration/CSS build, and from 0.57s to 0.26s
for all 41 tests. Test names and generated output hashes matched exactly.

These measurements cover development tooling, not browser rendering or game
performance. The first process run was recorded separately; operating-system
caches were not flushed, and no cold-network installation speed is claimed.
Re-measure on the same machine and source revision before generalizing the result.

## Native checks and formatting

Bun 1.4.4 is the current stable pin. `bun lint` is a project script combining
module-boundary validation with native `bun fmt --check`; Bun has no built-in
general-purpose lint command. `bun check` invokes the project check script,
including declaration verification and native type checks for the behavior and
consumer projects. Internal type-check commands use `--no-script` to avoid
recursing into the project script.

`bun fmt` replaces Biome for authored source and emitted declaration formatting.
TypeScript remains a development dependency because declaration emission is
still performed by its compiler; Bun's native checker does not emit declarations.
The package has no runtime dependencies. Generated CSS, icons and declarations
are checked separately rather than reformatted in place. This formatter change
is a one-time formatting migration, not a change to public behavior contracts.
