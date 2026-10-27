# Class-styled native dialogs

Use native HTML with explicit CSS classes. The library never styles every `dialog` on the page. Add `rw-dialog` to opt in; native browser focus, inertness, Escape handling and form return values remain intact.

[Open the dialog playground](https://kahwee.github.io/runway-ui/storybook/?path=/story/foundations-dialog--playground). Change arguments, then open the modal to inspect them. Controls live outside its iframe, so they remain available while the preview dialog is modal.

```html
<button class="rw-button" commandfor="decision" command="show-modal">Open decision</button>
<dialog
  class="rw-ui rw-dialog rw-dialog--wide"
  id="decision"
  closedby="any"
  aria-labelledby="decision-title"
  aria-describedby="decision-description"
>
  <header class="rw-dialog__header">
    <div>
      <p class="rw-dialog__eyebrow">Expedition ready</p>
      <h2 class="rw-dialog__title" id="decision-title">Chart the next frontier?</h2>
    </div>
    <button
      class="rw-dialog__close"
      aria-label="Close dialog"
      commandfor="decision"
      command="close"
    >
      <span class="rw-icon" data-icon="x" aria-hidden="true"></span>
    </button>
  </header>
  <div class="rw-dialog__body">
    <p id="decision-description">This expedition costs 200 credits.</p>
  </div>
  <form class="rw-dialog__footer" method="dialog">
    <button class="rw-button" value="cancel" autofocus>Cancel</button>
    <button class="rw-button" data-variant="primary" value="confirm">Confirm</button>
  </form>
</dialog>
```

## Class contract

| Class                        | Purpose                                                                     |
| ---------------------------- | --------------------------------------------------------------------------- |
| `rw-dialog`                  | Opt-in dialog surface, viewport bounds, backdrop and native open transition |
| `rw-dialog--compact`         | 380px preferred width                                                       |
| `rw-dialog--wide`            | 760px preferred width; default base width is 520px                          |
| `rw-dialog--danger`          | Danger border and eyebrow color; use a danger action separately             |
| `rw-dialog__header`          | Heading group and optional close action                                     |
| `rw-dialog__eyebrow`         | Context label                                                               |
| `rw-dialog__title`           | Dialog heading typography                                                   |
| `rw-dialog__body`            | Scrollable long-form content, at most 50dvb                                 |
| `rw-dialog__footer`          | Wrapping action row, aligned to the inline end                              |
| `rw-dialog__footer--split`   | Actions at opposite ends                                                    |
| `rw-dialog__footer--stacked` | Vertically stacked actions in DOM and keyboard order                        |
| `rw-dialog__close`           | Focus-visible native close button                                           |

Use one size modifier and one footer modifier at a time. Set `--rw-dialog-width` in your own CSS to customize a size. Theme and density live on `rw-ui`; a nested dialog root must receive the application's chosen theme and density too.

The complete `index.css` or bundle includes this component. The `runway-ui/dialog.css` module owns the base surface, backdrop, structure and modifiers in the `runway-ui.dialog` layer. Import tokens alongside it when selecting modules. `primitives.css` no longer includes dialog styles; consumers importing it directly must also import `dialog.css`. It is independent of the optional `runway-ui/dialog` JavaScript helper.

## HTML owns interaction

- `commandfor` plus `command="show-modal"` opens the native top layer; `command="close"` closes explicitly.
- `form method="dialog"` closes with the submitter's `value` as `returnValue`.
- `closedby="any"` permits light dismiss and close requests; `closerequest` permits Escape; `none` requires explicit actions.
- Keep an enabled explicit exit action even when dismissal is restricted. Disabling every action can trap users.
- Put autofocus on a safe initial choice. Do not focus a disabled or absent control.

Invoker commands and `closedby` need current browser support. The optional `bindDialog` helper requires native `showModal()` and `close()`. It uses native `requestClose()` and `closedBy` when available. Without `requestClose()`, it dispatches a cancelable `cancel` event before calling native `close()`; every cancel listener can veto closure. Without `closedBy`, it recognizes a primary pointer gesture that begins and ends on the backdrop, then makes the same guarded close request. Dragging from inside the dialog, cancelled gestures and secondary pointers do not dismiss it. Required decisions retain the live `canDismiss` guard and cancel protection. No global prototype patch, custom focus trap or runtime dependency is introduced; the browser still owns focus, inertness, Escape and form return values.


## Action order and safe decisions

Use one primary action with a specific verb; give the safe alternative an equally
clear label. `rw-dialog__footer--stacked` now preserves DOM order. Put actions in
the order they should be read and tabbed through; do not use CSS reversal or
positive `tabindex` to move the primary action above the safe alternative.
Below 400px of dialog content width, ordinary footers also stack in DOM order.

Use paragraphs for distinct ideas, associated labels for inputs, and short
`aria-describedby` content. Avoid attaching an entire long document as the dialog's
accessible description. Long content scrolls inside the body; test that actions
remain reachable at your smallest supported desktop height and when zoomed.

For a required decision, use `closedby="none"`, omit the generic close button,
and keep an enabled explicit outcome. A dismissal guard does not validate a
purchase or form: the host validates before explicitly closing the dialog. Do not
use `form method="dialog"` for an asynchronous operation that may fail; submit to
your handler, show a meaningful error in the dialog, then close only on success.
The helper's `canDismiss` gates close requests, not direct `close()` calls or
`method="dialog"` submissions.

Try **Compact actions**, **Long content** and **Required decision** in the Dialog
Storybook group. The default story keeps focus on the safe alternative. See the
[design and usage review](DESIGN-REVIEW.md) for composition rules and validation scope.
