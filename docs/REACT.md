# React components

React is required. Components are in `runway-ui/react`; wrap them in `Runway` (defaults to the `cozy` theme). Charts use `@tanstack/charts` through `Chart` and `ChartCard`; see **React / Desk** in Storybook for a playable example.

The `runway-ui/react` entry uses React 19 and real Base UI primitives. The existing
HTML/CSS and `runway-ui/dialog` behavior remain independent of React, with no
runtime dependencies. Install the optional peers only in React consumers:

```sh
bun add react@^19 react-dom@^19 @base-ui/react@^1.9
bun add -D @types/react@^19 @types/react-dom@^19
```

```tsx
import "runway-ui/bundle.css";
import { Button, Field, Input } from "runway-ui/react";

export function Preferences() {
  return (
    <section className="rw-ui" data-theme="orbital">
      <Field.Root className="rw-field">
        <Field.Label>Workspace name</Field.Label>
        <Input defaultValue="Orchard" />
        <Field.Description>Used to identify this workspace.</Field.Description>
      </Field.Root>
      <Button type="button">Save preferences</Button>
    </section>
  );
}
```

`Button` and `Input` add `rw-button` and `rw-input`. They preserve Base UI props,
React 19 refs, `render` composition, disabled behavior and state-dependent
`className` functions. `Field`, `Checkbox` and `Select` are the upstream compound
primitives, without copied behavior or opinionated value adapters. Their APIs and
accessibility contracts are documented at [Base UI](https://base-ui.com/react/overview/quick-start).
Use `Field.Label` and `Field.Description` for programmatic input association.
Provide a label for every checkbox and selection control.

Try **React / Base UI forms** in Storybook: controlled input, keyboard select,
checkbox, disabled action and a save result all run in an actual React root. The
example unmounts its root when Storybook removes the canvas, avoiding stale roots
and duplicate callbacks on remount. Its layout CSS is example-owned. Components and args-driven stories are authored in
TSX with explicit prop types. `bun run check-types` checks these examples alongside
the published API; the distributed entry remains ready-to-import JavaScript.

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
verifies the committed React declaration. The vanilla boundary checker continues to
reject React or any other external runtime dependency in `behaviors/` and `styles/`.

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
