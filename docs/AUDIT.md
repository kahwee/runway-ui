# Ten-pass documentation and adherence audit

Audit date: 2026-10-22. Source baseline: `4a85b16`. Scope: contributor instructions,
public guides, source ownership, package/browser contracts, generated documentation
and validation claims. This is not a certification of every component or browser.

| Pass                    | Evidence reviewed                                       | Outcome                                                                                                        |
| ----------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1. Instructions         | AGENTS, contributor and compatibility policies          | Added current dialog requirements and pre/post-commit checks to contributor guidance.                          |
| 2. Setup                | packageManager, engines, scripts, frozen install        | Documented Node 22+, pinned pnpm and actual commands; distinguished development downloads from runtime assets. |
| 3. Ownership            | CSS entry points, behaviors, module checker             | Documented consolidated dialog ownership and linked the source map.                                            |
| 4. Public API           | package exports, dialog implementation and declarations | Added missing workspace/quiet/studio style aliases and native dialog requirements.                             |
| 5. Browser/CSS contract | dialog CSS, helper, modern-CSS guide                    | Removed stale older-browser fallback claims; added breaking migration notes.                                   |
| 6. Accessibility claims | status, dialog guards, prior Chrome 154 evidence        | Distinguished focused reduced-motion/forced-color checks from broad unverified coverage.                       |
| 7. Generated outputs    | build, icons, generated checker                         | Frozen install and generated comparison pass; both committed CSS outputs match source.                         |
| 8. CI and validation    | Package/Pages workflows, 16 tests                       | Clarified parallel jobs and added generated-doc link validation on PRs and Pages builds.                       |
| 9. Navigation           | tracked Markdown links and generated HTML               | Fixed missing heading anchors and root-document links; added `pnpm check-docs` to prevent recurrence.          |
| 10. Reconciliation      | final diff, lint, build-site, link checks               | Rechecked changed guidance against source and preserved deployment/publication boundaries.                     |

Validation: `pnpm check`, `pnpm check-boundaries`, `pnpm test-boundaries` (12 tests),
`pnpm test-dialog` (4 tests), `pnpm check-generated`, `pnpm build-site` and
`pnpm check-docs`. The link check covers local links, fragment targets and asset
references from generated documentation pages; it does not crawl external sites
or exercise every Storybook story. A deliberate broken-anchor probe verifies that
it fails rather than silently accepting missing destinations.

No new cross-browser or screen-reader verification was performed in this docs
pass. Prior Chrome 154 dialog checks remain scoped in [STATUS.md](STATUS.md).
No package release or branch-protection change is implied by a passing workflow.

## Optional loading extraction

Added independent resource, deferred stylesheet and action-routing modules with
TypeScript declarations, no runtime dependencies and no automatic feature imports.
The standalone lazy-workspace example keeps its simulation state in the host.
Automated coverage includes concurrent/retried loads, falsy results, duplicate and
mismatched action ownership, recycled controls and stylesheet listener cleanup.
Chromium checks at 1440 × 900 and 1366 × 768 opened the deferred panel and ordered
supplies without console errors. The documentation site and local link checker
passed. This is loading correctness evidence, not a frame-rate benchmark.

## Generated type contracts and behavior review

Reviewed all nine runtime behaviors and replaced parallel handwritten declarations
with strictly checked JSDoc and generated, formatted `.d.ts` output. Generation
compiles source copies without old declarations. Public exports retain their names;
object types become aliases, with the declaration-merging limitation documented.
Added package-entry consumer fixtures, expected-error assertions, export/output
validation and CI checks. A deliberate stale declaration was rejected without
rewriting it. The consumer fixture also compiled against an actual packed archive.

Strict checking tightened DOM query/event boundaries, generic item/resource
inference, native DOM string arguments and cached-promise handling. Reviewed
windowed history now validates offscreen observations, labels, indexes and options
before replacing host contents; empty data has finite geometry and disabled controls.
Destroyed timelines cannot redraw, and programmatic windows reject fractional/invalid
bounds and cancel queued redraws. Added Node regression coverage for these cases
and stylesheet setter failure cleanup/retry.

All 29 Node behavior/boundary/dialog contracts, strict source generation and consumer
types passed. The native browser fixture exercises all nine modules and passed in
Chromium 154 at 1440 × 900 and 1366 × 768, including range outputs, keyboard focus,
inventory replacement, native guarded dialogs, history gaps, empty/paged/destroyed
windows, resources, stylesheet loading and actions. No browser errors were reported.
The fixture is available at `tests/browser-contracts.html` for local reproduction;
CI runs Node contracts and type checks, not native browser automation. Storybook/site,
309 documentation links, frozen install, package checks and Biome passed. This review
does not claim cross-browser certification or a new performance benchmark.

## Quiet single-select fallback (2026-10-22)

Changed the quiet field surface to set background-color instead of resetting the
entire background. The fallback single-select skin retains its CSS chevron and
reserved arrow space; enhanced pickers retain their native picker icon. Added a
browser contract that checks the actual computed fallback appearance, chevron
image and end padding inside a quiet root.

Passed 29 Node tests, boundary checks, generated type verification, CSS/package
build, static Storybook/site build, 309 documentation links and pack dry-run.
Native Chromium 154 browser contracts passed all nine behavior modules, including
the new computed-style assertion, at 1440×900 and 1366×768. No browser behavior API
or dependency changed. This is a Chromium result, not cross-browser certification.
