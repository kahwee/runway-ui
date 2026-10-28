# Simulation Observatory

A responsive reference composition combining six small-multiple trend cards,
observed/projected output, a target, exact observations, a resource ledger and
an explicit decision review. All observations and budgets are synthetic.

[Open the Observatory](../examples/observatory.html) ·
[Storybook arguments](../storybook/?path=/story/compositions-simulation-observatory--playground)

## Rendering and ownership

`renderObservatory(options)` produces semantic HTML, exact tables and chart
hosts. `bindObservatory(root, data)` mounts TanStack charts, binds the native
review/inspection controls and returns `destroy()`. Always destroy before
removing the composition: this unmounts every chart root and clears listeners.
Applications keep their own data, persistence and simulation rules.

The same shared example renderer powers the chart lab, Colony history and
landing-page plot. React/TanStack are bundled locally for native-module pages.
Styles arrange the workspace; TanStack alone draws quantitative geometry.

## Data contracts

- Values must be finite nonnegative numbers within the declared fixed scale, or
  `null` for a missing observation. Invalid inputs produce a readable error.
- A missing value ends a line; it is never zero or a smoothed estimate.
- Projected cycles are a separate named series, and the exact table retains the
  Observed/Projected status of every input. Forecasts are not guaranteed.
- Each trend delta compares the final two observations. If either is missing,
  the comparison is unavailable. Small-multiple sequences are independent.
- The target is a TanStack rule and is also stated in text. Event notes name
  their cycle and appear both in a native popover and the exact-data disclosure.
- The decision preview uses a native dialog. Pinning a plan changes only local
  preview feedback; it spends no resources and makes no gameplay claim.

## Responsive and accessibility boundaries

Charts fit their containers and have accessible names with measurement units.
Use keyboard chart navigation or the exact table. Resource rows become labelled
cards on phones; long ledgers keep named keyboard scroll regions. Native dialog
focus, cancellation and popover behavior remain browser-owned. Missing popover
support does not hide the duplicate event note in the exact-data disclosure.
