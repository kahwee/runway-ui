# Class-styled native dialogs

Use native HTML with explicit CSS classes. The library never styles every `dialog` on the page. Add `g-dialog` to opt in; native browser focus, inertness, Escape handling and form return values remain intact.

[Open the dialog playground](https://kahwee.github.io/runway-ui/storybook/?path=/story/foundations-dialog--playground). Change arguments, then open the modal to inspect them. Controls live outside its iframe, so they remain available while the preview dialog is modal.

```html
<button class="g-button" commandfor="decision" command="show-modal">
  Open decision
</button>
<dialog
  class="g-ui g-dialog g-dialog--wide"
  id="decision"
  closedby="any"
  aria-labelledby="decision-title"
  aria-describedby="decision-description"
>
  <header class="g-dialog__header">
    <div>
      <p class="g-dialog__eyebrow">Expedition ready</p>
      <h2 class="g-dialog__title" id="decision-title">
        Chart the next frontier?
      </h2>
    </div>
    <button
      class="g-dialog__close"
      aria-label="Close dialog"
      commandfor="decision"
      command="close"
    >
      ×
    </button>
  </header>
  <div class="g-dialog__body">
    <p id="decision-description">This expedition costs 200 credits.</p>
  </div>
  <form class="g-dialog__footer" method="dialog">
    <button class="g-button" value="cancel" autofocus>Cancel</button>
    <button class="g-button" data-variant="primary" value="confirm">
      Confirm
    </button>
  </form>
</dialog>
```

## Class contract

| Class                       | Purpose                                                                     |
| --------------------------- | --------------------------------------------------------------------------- |
| `g-dialog`                  | Opt-in dialog surface, viewport bounds, backdrop and native open transition |
| `g-dialog--compact`         | 380px preferred width                                                       |
| `g-dialog--wide`            | 760px preferred width; default base width is 520px                          |
| `g-dialog--danger`          | Danger border and eyebrow color; use a danger action separately             |
| `g-dialog__header`          | Heading group and optional close action                                     |
| `g-dialog__eyebrow`         | Context label                                                               |
| `g-dialog__title`           | Dialog heading typography                                                   |
| `g-dialog__body`            | Scrollable long-form content, at most 50dvh                                 |
| `g-dialog__footer`          | Wrapping action row, aligned to the inline end                              |
| `g-dialog__footer--split`   | Actions at opposite ends                                                    |
| `g-dialog__footer--stacked` | Vertically stacked actions, primary above cancel                            |
| `g-dialog__close`           | Focus-visible native close button                                           |

Use one size modifier and one footer modifier at a time. All original `g-dialog` markup remains valid; structured child classes are additive. Set `--g-dialog-width` in your own CSS to customize a size. Theme and density live on `g-ui`; a nested dialog root must receive the application's chosen theme and density too.

The complete `index.css` or bundle includes this component. The `runway-ui/dialog.css` module contains the additive structure and modifiers; it requires the tokens and existing primitive/native-dialog styles, or the complete stylesheet, for the base surface. It is independent of the optional `runway-ui/dialog` JavaScript helper.

## HTML owns interaction

- `commandfor` plus `command="show-modal"` opens the native top layer; `command="close"` closes explicitly.
- `form method="dialog"` closes with the submitter's `value` as `returnValue`.
- `closedby="any"` permits light dismiss and close requests; `closerequest` permits Escape; `none` requires explicit actions.
- Keep an enabled explicit exit action even when dismissal is restricted. Disabling every action can trap users.
- Put autofocus on a safe initial choice. Do not focus a disabled or absent control.

Invoker commands and `closedby` need current browser support. Older browsers can use the optional `bindDialog` helper for opening and dismissal policy. Styling uses the same classes in either case. The class API adds no JavaScript dependency.
