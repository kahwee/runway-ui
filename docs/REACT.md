# React components

React is required. Components are in `@kahwee/runway-ui/react`. Wrap them in `Runway`, which
sets the theme root (`cozy` by default). Charts use `@tanstack/charts`; form controls
use Base UI primitives.

## Install

```sh
bun add @kahwee/runway-ui react@^19 react-dom@^19 @base-ui/react@^1.9 @tanstack/charts
```

```tsx
import "@kahwee/runway-ui/bundle.css";
import { Button, Meter, Panel, Runway } from "@kahwee/runway-ui/react";

export function Briefing() {
  return (
    <Runway theme="cozy">
      <Panel kicker="Today" title="Morning briefing">
        <Meter label="Team energy" value={72} tone="morale" />
        <Button data-variant="primary">Next day</Button>
      </Panel>
    </Runway>
  );
}
```

Import `@kahwee/runway-ui/bundle.css` once (self-contained) or `@kahwee/runway-ui` for the
modular entry. `@kahwee/runway-ui/cozy.css` is the theme on its own. Try **React / Desk** and
**React / Components** in Storybook for playable examples.

## Component reference

| Component | Renders | Key props |
| --- | --- | --- |
| `Runway` | Theme root `div.rw-ui` | `theme` (`cozy`, `cozy-night`, `ledger`, `orbital`, `parchment`, `whimsy`, `midnight`), `density` |
| `Panel` | `section.rw-panel` | `title`, `kicker`, `actions` |
| `Icon` | Decorative Phosphor icon (`span.rw-icon`) | `name` (`coins`, `heart`, `users`, `lightning`, `rocket`, `sun`, ...), `weight`, `size` |
| `Badge` | `span.rw-badge` | `tone` (`warning`, `danger`) |
| `Meter` | `div[role=meter]` capsule | `label`, `value`, `max`, `tone` |
| `Progress` | native `<progress>` | native props |
| `Resource` | Resource bar entry | `icon`, `label`, `value` |
| `Button`, `Input` | Base UI Button and Input with Runway classes | Base UI props, `data-variant`, `data-size` |
| `Field`, `Checkbox`, `Select` | Base UI compound primitives | See Base UI docs |
| `Range` | Native slider with filled track and `<output>` | `label`, `format`, `onValueChange`, native range props |
| `Dialog` | Native `<dialog>` modal | `open`, `onClose`, `canDismiss` |
| `Inventory` | Slot grid with roving focus | `items`, `columns`, `selected`, `onSelect` |
| `CommandBar` | Desk status bar | `title`, `stats` |
| `FolioTabs` | Vertical section navigation | `label`, `items`, `value`, `onValueChange` |
| `Sheet` | Paper section | `title`, `description` |
| `DossierList`, `Dossier` | Aligned record rows | `kicker`, `status`, `title`, `description`, `actions` |
| `ControlConsole` | Time and workflow controls | children |
| `AnimatedNumber` | Counting `span.rw-number` | `value`, `format`, `duration` |
| `Confetti` | Fixed overlay burst | `active`, `onDone`, `count` |
| `ToastProvider`, `useToasts` | Base UI Toast with a Runway-styled stack | `timeout`, `limit`; `push(message, tone)`, `dismiss(id)` |
| `Chart`, `ChartCard`, `defineChart` | TanStack Charts adapter and card | `definition`, `height`, `ariaLabel` |

`CommandBar` stats, `FolioTabs` items and `Meter` accept an `icon` (use `Icon`). `Meter` clamps `value` to `0..max` for both its fill and `aria-valuenow`. Invalid or
nonpositive maxima use 100; nonfinite values use 0. `Dialog` keeps the browser
in charge of focus and inertness. Pass `canDismiss={() => false}` to veto Escape and
backdrop dismissal while a decision is required; the policy is reapplied on every render.
`Inventory` moves focus with arrows, Home and End, skipping disabled slots. Focus
is remembered by item `id`; keep IDs unique and stable when reordering items.
Removing or disabling the remembered slot makes the first available slot the Tab
entry. Empty or fully disabled inventories have no slot in the Tab order. It does
not virtualize, so keep lists to a few hundred slots.

## Range

Use `defaultValue` for local state, or pass `value` and `onValueChange` for a
controlled slider. The latter lets presets and application state update the native
thumb, filled track and formatted output together. Consumer styles and native
input props are forwarded. Keep values within `min` and `max` and aligned to `step`,
as with a native controlled range input.

```tsx
const [allocation, setAllocation] = useState(25);
<Range label="Resource allocation" value={allocation} onValueChange={setAllocation}
  min={0} max={100} step={5} format={(value) => `${value}%`} />;
```

The `rw-field rw-range-field` wrapper uses the shared slider layout. A native
label and output reference the input's supplied `id` (or a generated unique ID),
so the formatted value does not become part of the slider's accessible name.
Try **React / Interactions** for presets, keyboard navigation, disabled slots and
inventory changes.

## Motion and feedback

`AnimatedNumber` tweens to its new value and bumps; `Resource` and `CommandBar` use it for numeric
values automatically. `Meter` flashes when its value changes and pulses at 25% or below
(`data-low`). `Confetti` bursts when `active` turns true, then calls `onDone`. Toasts use
Base UI's Toast (swipe to dismiss, hover to pause, stacking): mount `ToastProvider` once inside `Runway`, then call `useToasts().push(message, tone)` from any child. Give the main action `data-attention` for a
soft pulsing ring in the cozy theme. All of it is skipped under `prefers-reduced-motion`.
`haptic("tap" | "success" | "warning" | pattern)` vibrates touch devices and returns `false` where unsupported, so it is always safe to call. See **React / Feedback** in Storybook.

## Charts

`Chart` is the `@tanstack/charts/react` adapter. Build a definition with `defineChart`, memoize
it, and render it inside a `Runway` root so the cozy palette (`--ts-chart-1` to `-6`) applies:

```tsx
const chart = useMemo(
  () =>
    defineChart({
      marks: [lineY(history, { x: "day", y: "cash" })],
      scales: { x: { scale: scaleLinear }, y: { scale: scaleLinear, nice: true, grid: true } },
    }),
  [history],
);
<ChartCard title="Credits by day"><Chart definition={chart} height={240} ariaLabel="Credits by day" /></ChartCard>;
```

Marks, scales and tooltips come from `@tanstack/charts` subpaths. See its
[documentation](https://tanstack.com/charts) for the full grammar.

## Portals and themes

A portal attached to `document.body` does not inherit a themed `.rw-ui` ancestor.
Give `Select.Portal` an explicit `container` inside the relevant theme root, as the
story does, or supply a separate themed `.rw-ui` portal host. Keep that host outside
any clipping scroll region. A consumer's event-ownership guards must recognize its
own portal host; a body portal is not a descendant of the original trigger.

The React entry does not wrap dialogs. The existing native dialog helper remains
unchanged, including mandatory-decision cancel vetoes and native focus/inertness.
Do not replace it with a different dialog primitive as an incidental migration.

## Packaging and validation

The optional entry ships JavaScript and generated declarations, in built package archives. Run `bun install --frozen-lockfile && bun run build`
after checking out a GitHub source archive. It has no JSX compilation requirement, but a consumer bundler must resolve
its React/Base UI bare imports. Named imports support tree shaking; the package
retains CSS side effects. A tested Button-only bundle drops other primitive imports.

Run `bun run build-react-types`, `bun run check-types`, `bun run test-behaviors`,
`bun run check-boundaries`, and `bun run build-storybook`. `bun run check-generated` also
verifies the committed React declaration. The boundary checker rejects React and other external dependencies in `behaviors/` and `styles/`.

## Progress

`Progress` styles a native `<progress>` with `rw-progress`; it accepts native props
and React refs. Import the full bundle or `styles/meters.css` with the base tokens.
Always provide a label (`aria-label`, `aria-labelledby`, or a native `<label>`).
Pass the original work units with `value` and `max`; use `aria-valuetext` when
those units matter. Omit `value` for indeterminate work. The browser owns range
clamping and progress semantics. No live region is added on frequent updates.

```tsx
<Progress aria-label="Experiment" value={3} max={10} aria-valuetext="3 of 10 workdays" />
```

The shared meter color/height tokens apply. Forced colors restore native progress
appearance; indeterminate work retains the browser's native rendering.
