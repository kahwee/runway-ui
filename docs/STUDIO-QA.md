# Paper studio and native-control review

Reviewed with agent-browser and Chromium on 2026-10-22.
- Inspected the paper command bar, navigation, illustrated season cover, standings and controls at 1440×900 and 1366×768. No horizontal page overflow.
- Opened native CSS pickers, selected with ArrowDown/Enter, dismissed with Escape, inspected disabled and grouped options, and verified long labels wrap. System-picker opt-out keeps native dropdown behavior; multiple and size=3 remain native listboxes (`appearance:auto`).
- Selected pace buttons by mouse; only one button is pressed. Selected faces are distinct from hover and idle, with a separate warm state. Reduced-motion emulation gives a zero-duration transition.
- No browser errors. Formatting/lint, CSS bundle, Storybook and public-site builds pass.

The paper appearance is opt-in and coexists with the quiet appearance. The example artwork is decorative and has no embedded ranking data. No simulation rules, runtime dependency or custom listbox implementation is added.
