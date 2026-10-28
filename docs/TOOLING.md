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
## Build ownership and cleanup

`bun run build` coordinates four generators: behavior declarations, React
declarations, runtime JavaScript and bundled CSS/icons. They run concurrently
because they own distinct files. The coordinator waits for all four and fails if
any fails;
site assembly and packaging only proceed after a successful build.
`bun run check-generated` uses that same coordinator before comparing with HEAD.

Runtime compilation finishes in memory before synchronizing `.js` files.
Declarations finish in a temporary directory before synchronizing `.d.ts` files.
The shared generated-file writer removes retired modules of the same file type,
including nested owners, and preserves other generators' files. Syntax/type
errors preserve the last successful outputs. Check mode reports stale and retired
declarations without mutation. This prevents an incremental build from packaging
removed vanilla behaviors or obsolete component groupings.

Both declaration builds compile into unique temporary directories with emission on
errors disabled. The directory is removed on success or failure. The generator
resolves tools and paths relative to the repository, so it can be invoked from
another working directory.

Use `bun run clean` to remove `.site`, `storybook-static` and legacy `.types`
output, plus disposable `dist/behaviors` and `dist/react`. It preserves committed CSS, icons and installed dependencies.
Then `bun run build-site` recreates the package, Storybook and documentation site.
Storybook runs after package generation so it never reads icons while they are
being regenerated. No build-speed improvement is claimed without measurement.

## Native build APIs

Generators and checks use `Bun.file`, `Bun.write`, `Bun.Glob`, native URL/path
conversion and checked `Bun.spawnSync` subprocesses. Generated CSS, declarations
and site contents must remain unchanged when changing these implementation APIs.
Failed compilers must not replace an existing declaration, and temporary source
copies must be removed on success or failure.

Directory copying, temporary-directory creation, recursive cleanup and path
normalization still use Bun's Node-compatible standard-library APIs where there
is no equivalent direct Bun file operation. These run inside Bun; they do not
launch Node. Third-party tooling may still require Node. Browser modules continue
to use browser APIs, not Bun globals.

All authored tooling now uses `.ts` and runs directly with Bun. `bun run build`
generates browser JavaScript and package declarations; see [TypeScript](TYPES.md)
for source-archive and static-site build instructions.
