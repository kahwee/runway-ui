# Development tooling

Use Bun 1.4.4, pinned in `.bun-version` and `package.json`, with the committed
`bun.lock`. Run `bun install --frozen-lockfile`; CI uses the same pin and frozen
install. Node 22.18+ or 24.11+ remains available for third-party CLI programs,
including Storybook. The CSS and optional browser behaviors require no runtime
package dependencies.

```sh
bun run check
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
configuration. Existing exact-version release-age exceptions are carried into
`bunfig.toml`; no new exceptions are introduced. Do not broaden dependency trust
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
