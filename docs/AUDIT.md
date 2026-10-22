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
