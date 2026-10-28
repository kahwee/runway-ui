# Game input

These components are unreleased additions on main; use a source checkout until
they are included in a package release.

`InputScope` adds local shortcuts and optional standard-gamepad navigation to
React interfaces. `InputHints` derives visible key hints from the same bindings.
Application state owns actions, remapping and selection. Neither component adds
document-wide keyboard listeners or changes the native Tab order.

```tsx
import { useState } from "react";
import { Button, InputHints, InputScope, type InputBinding } from "@kahwee/runway-ui/react";

function Commands() {
  const [cycle, setCycle] = useState(1);
  const [key, setKey] = useState("n");
  const bindings: InputBinding[] = [{
    id: "next", label: "Next cycle", key,
    onActivate: () => setCycle(value => value + 1),
  }];
  return <InputScope aria-label="Simulation commands" bindings={bindings} columns={2}>
    <Button data-rw-focus-item="" onClick={() => setCycle(value => value + 1)}>Next cycle</Button>
    <Button data-rw-focus-item="" onClick={() => setKey(key === "n" ? "x" : "n")}>Remap key</Button>
    <InputHints bindings={bindings} />
    <p>Cycle {cycle}</p>
  </InputScope>;
}
```

Render inside `Runway` (or a `.rw-ui` root). Import the full bundle, or `styles/input.css` with tokens and the control styles
used by your children. Supply an accessible scope label. Ordinary div props,
classes, event handlers and React refs are forwarded. A consumer `onKeyDown`
handler runs first and can veto the scope by preventing default.

## Binding contract

Each binding has a stable unique `id`, human-readable `label`, a `key` matching
`KeyboardEvent.key`, an `onActivate()` callback and optional `ctrlKey`, `altKey`,
`metaKey`, `shiftKey` booleans. Modifiers must match exactly. Letter matching is
case-insensitive, but Shift is still an explicit modifier. Held/repeating and
IME composition events do not activate shortcuts. Avoid conflicting bindings;
the first exact match wins. Avoid browser/OS shortcuts reserved by your target
platform. No keyboard layout or physical-key guessing is performed.

Replace the binding array to remap keys. The scope reads current callbacks and
`InputHints` shows current combinations; Runway does not persist settings.
Tab is reserved for native focus, and native button/link/summary Enter and Space
activation takes priority over bindings. Bindings work only when focus belongs to the scope. Input, textarea, select,
contenteditable and compound editing widgets keep their own keys. Nested scopes
own their input independently, including when the ancestor has the same key.
An outer scope cannot navigate behind a native modal. An explicit scope inside
the modal can operate there without replacing native focus and inertness.

## Directional navigation

Mark opt-in focus targets with `data-rw-focus-item`. Arrow keys move focus;
Home/End jump to the first/last available target. Tab and native button
Enter/Space are unchanged. Directional/controller navigation skips hidden, inert, disabled and aria-disabled
targets. Native controls and applications retain their own disabled activation contracts. Disabled slots retain their positions when calculating vertical
movement. `columns` defaults to 1 and must reflect the layout owned by the app;
Runway does not measure or rearrange your layout. Left/right respect RTL direction.
`loop` defaults to false. Looping is indexed navigation, not spatial collision
navigation. Keep controls semantic and selection state in the application.

Do not mark composite widgets such as selects, sliders, tablists or inventory
cells as scope navigation targets. Those widgets retain their own keyboard
contracts. `Inventory` already provides its own roving focus.

## Optional controller

Set `gamepad` after an explicit application-level opt-in. The first connected
standard-mapped pad uses D-pad/left stick for movement (dead zone 0.6), south
button (A/Cross) to activate the focused marked target, and east button
(B/Circle) to call optional `onBack`. Activation/back are edge-triggered;
directions repeat after 350ms, then every 120ms. A button held when focus enters
cannot activate until it is released and pressed again.

Polling stops when focus leaves the scope, belongs to a nested scope/editor,
the document is hidden or its window loses focus, no standard pad is available, or the component unmounts.
Policy-restricted/unsupported Gamepad APIs retain keyboard and pointer controls.
The app supplies visible controller instructions and decides what Back means;
there is no implicit close, navigation, rumble or nonstandard mapping.

Automated tests use simulated standard pad snapshots. Physical-controller,
platform and screen-reader behavior still need device validation.

## Reproduce browser checks

```sh
bun run build
bun run build-storybook
python3 -m http.server 6031 --bind 127.0.0.1
# In another terminal:
bun scripts/check-game-input.ts http://127.0.0.1:6031/storybook-static/
```

The explicit agent-browser check covers five viewport sizes, native keyboard and
editing behavior, remapping, nested scopes, dialog guards, visible mobile console
text and simulated controller input. It also runs the generated dialog policy on
a native modal while locally simulating missing newer dismissal APIs. This is
not a cross-browser or physical-device certification.
