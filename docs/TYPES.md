# Types and behavior contracts

The nine optional behaviors are plain JavaScript with checked JSDoc. JavaScript is
the single source for implementation, public option types and generated declarations.
Do not edit `behaviors/*.d.ts` by hand. There is no runtime TypeScript dependency or
new bundling requirement for consumers.

## Build and verification

```sh
bun run build-types
bun run check-types
bun run test-behaviors
bun run build
```

`build-types` compiles every behavior with `allowJs`, `checkJs` and `strict`, using
DOM libraries and the pinned TypeScript development dependency. It copies only
JavaScript into a temporary directory first. Existing declarations cannot affect
inference or conceal implementation errors. The temporary files are removed even
on failure. Compiler diagnostics stop generation; emitted declarations are formatted
with the pinned Biome version and committed beside their source.

`check-types` regenerates in memory/temp files, compares all declarations without
rewriting them, validates each behavior's package `types` export and rejects orphan
declarations. It then compiles `tests/types/consumer.ts` through real package entry
names under NodeNext resolution. Positive fixtures check inferred generic values,
callback arguments and public named types. `@ts-expect-error` fixtures must reject
invalid calls; an accidentally permissive type makes that check fail.

`build` generates declarations and CSS. `check-generated` compares both generated
outputs against `HEAD`, so run it after committing intentional changes. CI checks
types, consumer fixtures and behavior tests in a separate job. Package archives
include declarations; consumers do not need to generate them.

## Module map

| Entry        | Owns                                                           | Host responsibility / limit                                              |
| ------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `dialog`     | Native dismissal policy and cancellation guard                 | Content, decision policy, supported native browser capabilities          |
| `forms`      | Range output and CSS fill synchronization                      | Native input constraints, formatting, labels                             |
| `navigation` | Roving focus and opt-in gamepad polling                        | Selection semantics, item markup, valid HTML control selector            |
| `inventory`  | Fixed-height virtual grid and item selection                   | Item records, CSS-compatible dimensions, application outcomes            |
| `history`    | Escaped signed-history HTML, gaps and annotations              | Finite observations, labels, scale and units; at most 366 visible values |
| `timeseries` | Whole-series overview, visible window and native paging        | Full observations and labels, valid indexes and sizes, persistence       |
| `resource`   | Concurrent load coalescing, caching and retry URL construction | URL base, loader, current-state rendering, reload policy                 |
| `styles`     | Deferred link download, readiness and listener cleanup         | Existing cascade slot, URL, mounted link lifetime                        |
| `actions`    | Unique action ownership and optional lazy handler groups       | Action names, services, event delegation and game rules                  |

Keep browser code independent of stories, examples and application modules.
Declarations are an output of these modules, not another parallel implementation.

## API accuracy and limits

Generic item and resource types are inferred from input records and loaders.
`unknown` is intentional for unvalidated errors and arbitrary action results; do
not replace it with `any`. Public controller names remain available. Generated
object declarations are type aliases rather than handwritten interfaces; they
retain structural use and `extends` compatibility, but do not support declaration
merging. No declaration promises literal runtime results for arbitrary action maps.

TypeScript checks shapes, not runtime numeric ranges, feature ownership or browser
support. Tests and native browser checks remain necessary. The windowed history
validates its full series before replacing host contents, including offscreen
values, labels and annotation indexes. Starts must be non-negative integers;
window sizes are 1–366, and overview bins are positive integers. Valid oversized
starts clamp to the final window. Empty series use size zero and disabled controls;
destroyed windows cannot redraw. See [history](INSTRUMENTS.md), [loading](LOADING.md)
and [dialog requirements](DIALOG.md).

For native browser verification, serve the repository root and open
`tests/browser-contracts.html`. It exercises all nine modules with real DOM controls
and reports pass/fail. This fixture is local development tooling, excluded from the
public documentation site and package; the CI behavior job runs the existing `node:test` contracts under Bun,
not this browser fixture. Check it at both supported desktop review sizes.
