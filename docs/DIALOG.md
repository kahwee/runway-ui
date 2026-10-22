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
| `rw-dialog__body`            | Scrollable long-form content, at most 50dvh                                 |
| `rw-dialog__footer`          | Wrapping action row, aligned to the inline end                              |
| `rw-dialog__footer--split`   | Actions at opposite ends                                                    |
| `rw-dialog__footer--stacked` | Vertically stacked actions, primary above cancel                            |
| `rw-dialog__close`           | Focus-visible native close button                                           |

Use one size modifier and one footer modifier at a time. All original `rw-dialog` markup remains valid; structured child classes are additive. Set `--rw-dialog-width` in your own CSS to customize a size. Theme and density live on `rw-ui`; a nested dialog root must receive the application's chosen theme and density too.

The complete `index.css` or bundle includes this component. The `runway-ui/dialog.css` module contains the additive structure and modifiers; it requires the tokens and existing primitive/native-dialog styles, or the complete stylesheet, for the base surface. It is independent of the optional `runway-ui/dialog` JavaScript helper.

## HTML owns interaction

- `commandfor` plus `command="show-modal"` opens the native top layer; `command="close"` closes explicitly.
- `form method="dialog"` closes with the submitter's `value` as `returnValue`.
- `closedby="any"` permits light dismiss and close requests; `closerequest` permits Escape; `none` requires explicit actions.
- Keep an enabled explicit exit action even when dismissal is restricted. Disabling every action can trap users.
- Put autofocus on a safe initial choice. Do not focus a disabled or absent control.

Invoker commands and `closedby` need current browser support. Older browsers can use the optional `bindDialog` helper for opening and dismissal policy. Styling uses the same classes in either case. The class API adds no JavaScript dependency.
