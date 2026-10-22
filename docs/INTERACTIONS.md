# Interaction contracts

The CSS entry has no JavaScript side effects. Import each behavior explicitly, retain its returned handle and call `destroy()` on unmount. All interactions operate on the supplied root; there are no document-wide key listeners.

## Roving focus

```js
import { bindNavigation } from '../behaviors/navigation.js';
const navigation = bindNavigation(document.querySelector('[role=toolbar]'), {
  selector: 'button', columns: 3, wrap: false
});
// Arrow keys / Home / End move focus. Enter/Space use native button activation.
// After adding/removing/disabling buttons: navigation.refresh();
// On teardown: navigation.destroy();
```

Hidden or disabled native buttons are skipped. The helper owns tabindex while mounted and restores the original attributes on destroy. It does not implement ARIA tablist/tab-panel selection, spatial collision navigation or automatic selection-follows-focus. Supply semantic labels and keep selection state (`aria-pressed`) in the application. Column movement uses enabled-item order, appropriate for compact toolbars; use the virtual grid for indexed inventory cells.

## Controller

```js
import { bindGamepad } from '../behaviors/navigation.js';
const controller = bindGamepad(root, navigation);
// controller.destroy() stops requestAnimationFrame polling.
```

Opt in from a visible user action. The adapter uses the first connected **standard-mapped** Gamepad API controller, D-pad or left stick (threshold 0.55), primary button to activate. Movement repeats after 360ms then every 120ms; activation is edge-triggered. It only handles input when the document and supplied root have focus, and does not activate behind any native modal dialog. Keyboard and pointer input remain available. Browsers may require a controller gesture before exposing it. There is no remapping, rumble, nonstandard-controller or console-platform support. Physical-controller behavior has not been verified in this environment.

## Fixed-height virtual inventory

```js
import { createInventory } from '../behaviors/inventory.js';
const inventory = createInventory(root, {
  items: [{ id: 1, label: 'Copper ore', icon: '◇' }],
  columns: 8,
  onSelect(item, index) { /* host owns selected-item action */ }
});
inventory.setItems(filteredItems);
// inventory.destroy() disconnects listeners/ResizeObserver and clears owned markup.
```

The helper exclusively owns root children. It restores its owned root attributes, custom properties and pre-existing rw-virtual class state on teardown; destroy is idempotent. It never writes HTML strings: labels use textContent. It keeps a logical active index and selected index, scrolls to requested rows and renders the viewport plus one overscan row on either side. Arrow keys, Home/End and PageUp/PageDown work across unmounted rows. Native button Enter/Space selects, with aria-pressed, row/column indices and grid dimensions in the accessibility tree. The host supplies a live selection/result region and an accessible root label. `setItems()` resets selection, active index and scroll; filtering belongs to the host.

Default row height is 92px; cells are 84px inside padded rows. The rowHeight option sets --rw-row-height for both row and cell sizing, with a minimum of 32px. columns must be a positive integer, and overscan a non-negative integer. Variable-height cards are not supported. Search/filter is important for finding items without visual scrolling. Virtual DOM omission can limit screen-reader browse-mode access; this has not received a screen-reader audit. The example exposes logical row counts and navigation but does not claim WCAG conformance. For a small catalog prefer ordinary HTML, or offer an unvirtualized/searchable alternative where required.

The 10,000-item example demonstrates bounded DOM count, not a 10,000-unit simulation. No frame-rate benchmark is claimed.
