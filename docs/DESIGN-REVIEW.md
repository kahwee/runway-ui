# Design and usage review: twelve passes

2026-10-22, starting from `b7892ea`. Scope: workshop entry, paper studio controls,
and the native dialog journey. Goal: make component adoption clearer while keeping
visual hierarchy, reading order and keyboard behavior aligned. This is focused
review evidence, not a claim of complete library or WCAG conformance.

## Review sequence

| Pass | Review                             | Result                                                                                                                   |
| ---- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 1    | Current source and ownership       | Pulled main; changes stay in the workshop, dialog component, stories and guides.                                         |
| 2    | Entry hierarchy and identity       | Workshop hierarchy remains clear; replaced a missing arrow glyph with the shared icon and named the home link.           |
| 3    | Typography and content density     | Dialog body now uses explicit 14px/1.6 typography, with spacing between separate paragraphs.                             |
| 4    | Spacing and target size            | Close target is 36px; long header content can shrink without pushing the close action out.                               |
| 5    | Themes and desktop allocation      | Compact dialog fits all five themes; workshop/studio/controls have no page overflow at both target desktop sizes.        |
| 6    | Form labels and selected states    | Studio selects have associated labels; choosing a pace leaves exactly one pressed button.                                |
| 7    | Visual and keyboard order          | Stacked actions now follow DOM order; native Tab proceeds from safe alternative to confirmation.                         |
| 8    | Decision safety                    | Required-decision story resists Escape and exposes explicit outcomes; invalid no-exit combinations show author guidance. |
| 9    | Long content and constrained space | Long bodies scroll; focused footer actions remain reachable at 683 × 384 CSS pixels; RTL compact content fits.           |
| 10   | Motion and forced colors           | Reduced-motion surface/backdrop transitions are zero; forced-color dialog border remains solid.                          |
| 11   | Usage and semantic guidance        | Added compact/long/required stories, short-description control, nonempty-title guard and host-validation guidance.       |
| 12   | Final verification                 | Lint, boundary checks, 20 tests, CSS/site builds and generated documentation-link checks pass.                           |

## Apply these rules when composing a screen

- Establish one main task and one primary action per decision. Use specific verbs
  and label the safe alternative; avoid a row of equally emphasized buttons.
- Use library tokens and existing appearance controls. Put theme/density on each
  dialog root, because nested `rw-ui` roots establish their own tokens. The full
  bundle provides prerequisites; selective imports need the owning modules.
- Keep visual action order equal to DOM/tab order. The stacked footer modifier
  no longer reverses buttons. Arrange markup in the intended reading order.
- Use actual labels, native disabled states and visible focus. An icon-only button
  needs an accessible name; decorative icons stay hidden from assistive technology.
- Use short `aria-describedby` summaries. Leave long structured content available
  for normal reading instead of announcing the entire document on modal entry.
- For asynchronous decisions, validate in the host and close explicitly only after
  success. `closedby="none"` and cancel guards prevent dismissal, not direct close
  calls or native dialog-form submissions. Preserve an enabled explicit outcome.
- Check long labels, disabled confirmation, all relevant themes, reduced motion,
  forced colors and smallest supported desktop space. A library component may
  reflow at smaller sizes without turning the desktop examples into mobile apps.

## Evidence and limits

Current-run Chromium screenshots and DOM/keyboard checks covered the workshop,
paper studio, compact actions and long-content modal. Desktop sizes: 1440 × 900
and 1366 × 768. A 900 × 600 check confirmed the workshop's unsupported notice and
hidden workshop. The 683 × 384 dialog check is constrained-viewport evidence,
not a full browser-zoom or assistive-technology test. Five dialog themes were
checked for overflow and action order; that does not establish every color pair's
contrast. Firefox, Safari, screen readers and exhaustive contrast testing remain
unverified. No new compatibility shim, layout runtime or dependency was added.

Automated coverage: `pnpm test-boundaries` has 12 fixtures; `pnpm test-dialog` has
4 lifecycle tests and 4 story-contract tests. Story tests validate labels, safe
focus, explicit outcomes and invalid combinations; actual CSS order and geometry
were checked in Chromium. Run `pnpm build-site` then `pnpm check-docs` for guide
links, and `pnpm check-generated` after committing generated CSS changes.
