# Simulation Observatory

A generic desktop reference screen for understanding a changing system. [Open the Observatory](../examples/observatory.html) or [explore its Storybook arguments](../storybook/?path=/story/compositions-simulation-observatory--playground).

It brings together six small-multiple trend cards, an annotated observed/projected history, a target, a resource ledger, a selected-resource inspector and an explicit decision review. All figures are synthetic. There is no real simulation, backend, persistent save or external API.

## Use the parts

The complete stylesheet is `dist/runway-ui.css`. Selective consumers can combine tokens, primitives, layout, charts, `styles/history.css`, `styles/observatory.css` and themes. Package aliases `runway-ui/history.css` and `runway-ui/observatory.css` export the new style modules. They do not automatically load prerequisite modules.

The composition's renderer is an example, not a promised application framework API:

```js
import { renderObservatory } from './examples/observatory/render.js';
import { bindObservatory } from './examples/observatory/controller.js';

const { root, data } = renderObservatory({ scenario: 'recovery' });
document.querySelector('main').append(root);
const controller = bindObservatory(root, data);
// Before removing the view:
controller.destroy();
```

The example modules have no third-party imports. JavaScript validates/render inputs and handles inspector selection, dialog fallback and local plan feedback. It does not measure geometry or draw charts. The core library has no dependency on this example controller.

## CSS chart contract

| Class | Input | Meaning |
| --- | --- | --- |
| `g-spark` | `--g-chart-max` and per-child `--g-amount`; optional matching `data-value` | Tiny decorative bars; accompany with visible current value, units and comparison |
| `g-history` | `--g-chart-max`, `--g-chart-height`, `--g-target` | Observed/projected column composition on a declared absolute scale |
| `g-history__frame` | Axis plus plot wrapper | Axis height equals the plot's declared block size |
| `g-columns > li[data-projected]` inside history | Ordinary value and striped mark | Projection; text and exact table must identify it too |
| `g-columns > li[data-missing]` inside history | No numeric mark | Missing data; never encode as zero |
| `g-history__target` | `--g-target` between 0 and maximum | Dashed reference line with a visible target label |
| `g-history__event` | Native `popovertarget` button | Click/keyboard event note, not a hover-only tooltip |
| `g-resource-ledger` | Four columns: resource, storage, in/out, net | Header and rows share column tracks through subgrid |

The example validates 6–18 equally spaced observations, one string label per value, positive finite maximum up to 10,000 and finite nonnegative numbers within that scale. `null` means missing. It rejects invalid data visibly rather than clipping or coercing numeric strings. Projection count is 0–4; final projected observations never enter the observed summary or Output card. A missing final or previous observation makes its comparison unavailable. The other five instrument series are independent illustrative data, disclosed in the notebook.

The scale remains fixed between preset scenarios. Changing `maximum` changes the declared scale, not the data: a preset exceeding that scale is rejected. The CSS primitives do not validate input by themselves; hosts must preserve this contract. The target and marks must use the same positive maximum.

The history is a column chart: it does not interpolate, smooth or imply continuous measurements. Projection hatching is a status marker, not a statistical uncertainty interval. Events record an association; they do not establish causation. Large/irregular time series and uncertainty calculations belong in the host or a suitable plotting engine.

## Modern native behavior

- **Subgrid:** metric cards share label/value/comparison/spark rows; ledger header and resource rows share columns; history uses the existing shared-row column primitive.
- **Named container queries and `cqi`:** adjust panel balance and spacing inside a desktop workspace. Minimum viewport is 1100 × 640, with at least 960px of composition space (open Storybook Canvas in a new tab when the manager leaves less room). Smaller screens show a desktop-required notice.
- **Popover API + CSS anchor positioning:** event notes enter the browser top layer. Their native `popovertarget` invoker supplies the implicit anchor; `position-area`, named `@position-try` options and `position-try-fallbacks` place/flip the note without a positioning script. Without anchor positioning it opens centered. The event note is also available in the native exact-data disclosure. The composition targets browsers with the Popover API; it supplies no popover polyfill.
- **Declarative dialog commands:** the review button uses `commandfor` and `command="show-modal"`. Where that DOM capability is absent, the optional example controller calls native `showModal()`. Close actions are ordinary `form method="dialog"` buttons. Browser focus, Escape and inertness remain native. The preview is dismissible; applications with mandatory decisions must apply their own cancellation policy.
- **Scroll-driven animation:** an opt-in `scroll-timeline` drives the ledger's progress cue through a named `timeline-scope`. No scroll event listener. Unsupported engines retain the ordinary scrollable ledger without the cue. Reduced motion removes the progress animation, leaving a subdued static cue.
- **Typed `attr()`, logical properties, OKLCH `color-mix()`, native nesting, `:has()`, `@starting-style` and discrete overlay/display transitions** complement the existing baseline. Numeric custom properties are supplied alongside typed attributes.

Forced colors retain solid observed marks, outlined/dashed projected marks and text labels. Missing bars retain their explicit missing label and exact table. Neither color nor hatch alone carries the data.

## Useful Storybook arguments

The Playground exposes heading/copy, six scenario choices, unit, maximum, target, plot height, custom data and labels, forecast count, event visibility/location/text, grid, exact-table state, row count, selection, long labels, scroll cue, available credits, upfront and recurring costs, expected effect, disabled decision and whimsy. Theme/density/depth remain global toolbar settings.

Three companion fixtures exercise shortage with insufficient budget, missing readings with long labels, and full/zero/missing boundary values with an event at the chart edge. Control changes remount the composition and dispose its previous controller. They reset selected-resource and pinned-plan feedback. The pin action acknowledges a preview choice only: no purchase, resource deduction or forecast change occurs.

## Quality scope

Read the current [status](STATUS.md) for observed browser/build results. These are not cross-browser or assistive-technology certification. The narrow-screen notice is intentional; there is no squeezed mobile gameplay view.

Primary browser references: [CSS anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using), [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using), [scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations), [button commands](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#command).
