# Native fields with breathing room

```html
<label for="department">Department</label>
<select class="rw-input" id="department">
  <option>Research & improbable inventions</option>
  <option>Operations & tea logistics</option>
</select>
```

A single-select gets `appearance:none`, a CSS-painted chevron inset 16px from its inline edge and 40px reserved end padding. Text cannot extend into the arrow gutter; short controls ellipsize long options. `dir="rtl"` flips the arrow and reserved padding. No wrapper, icon font, script or external image is required. Keep an associated label. The selected option and keyboard interaction remain native. `multiple` and `size` greater than 1 retain native listbox appearance and have no dropdown arrow.

Tune `--rw-select-inset` to change the edge distance. The text gutter follows it automatically. Comfortable and compact density both retain a comfortable arrow inset. Do not apply host `background` or `padding` shorthands over the shared field recipe: use tokens and layout classes instead.

For existing forms, place `rw-native` on a container inside a `rw-ui` root. The full bundle includes this opt-in skin. The `native.css` entry imports the same tokens, controls and fields when only form styling is needed. It no longer maintains a second button/field implementation.

## Native picker (customizable by default)

```html
<select class="rw-input" aria-label="Priority">
  <option>Proceed with cheerful caution</option>
  <option>After tea</option>
</select>
```

Inside `@supports (appearance:base-select)`, every `select.rw-input` (and `.rw-native select`) renders the customizable picker by default; both the select and `::picker(select)` use native customizable rendering. Add `data-picker="native"` to opt out. Multiple and `size` listboxes are never affected. The picker receives themed options, spacing and selection styling; `::picker-icon` remains at the end with its own gap. Other browsers use the padded native dropdown above. This is opt-in because support is still evolving. Reference: [MDN customizable select elements](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select).

Use `disabled`, `required`, `aria-invalid` and associated help/error text normally. Forced colors restores the native arrow; reduced motion disables picker-icon and control transitions. These accommodations do not establish assistive-technology conformance.

The [Clipboard Club example](../examples/controls.html) compares long labels, disabled/invalid states, RTL and listboxes. Storybook's Select playground exposes content, width, arrow inset, direction, state, skin and picker mode.

## Switch, slider, checkbox, radio and field patterns

All of these are real form controls; the classes only add skin. See the Foundations / Forms story.

| Pattern          | Markup                                                                                              | Notes                                                                                                                                                                                                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Switch           | `<label class="rw-toggle"><input class="rw-switch" type="checkbox" role="switch"> Label</label>`    | Thumb uses logical offsets, so RTL flips correctly. `data-layout="row"` makes a settings row.                                                                                                                                                                                 |
| Slider           | `<input class="rw-range" type="range">`                                                             | Native range. `rw-range-field` pairs it with an `<output for>`. Optional `runway-ui/forms` `bindRanges()` keeps the output and the `--rw-fill` track fill in step; without it the slider still works, just without the filled track in Blink/WebKit (Firefox fills natively). |
| Checkbox / radio | `<input class="rw-check" type="checkbox\|radio">`                                                   | `:indeterminate` is styled. The check reuses the generated Phosphor check icon.                                                                                                                                                                                               |
| Option cards     | `<label class="rw-option"><input class="rw-check" type="radio"> …</label>` in `fieldset.rw-options` | `:has(:checked)` and `:has(:focus-visible)` style the card; no JavaScript.                                                                                                                                                                                                    |
| Input group      | `.rw-input-group` with a `span` prefix/suffix                                                       | `:focus-within` shows one focus ring; `:has(:user-invalid)` shows the error border.                                                                                                                                                                                           |
| Fields           | `.rw-field`                                                                                         | Required marker via `label:has(+ :required)`, error colour via `:user-invalid`, textarea `field-sizing:content`, styled `::placeholder`, `::file-selector-button` and `:autofill`.                                                                                            |

Capability notes: `field-sizing` is optional (textareas keep their fixed minimum without it). `:user-invalid` and `:has()` are baseline in current engines. Motion respects `prefers-reduced-motion`; forced-colors replaces the skin with system colors.

## Select variants

Set data attributes on the `select`; the markup stays a plain native select. Everything below needs `appearance:base-select` and is ignored elsewhere.

| Attribute        | Values                                           | Effect                                          |
| ---------------- | ------------------------------------------------ | ----------------------------------------------- |
| `data-variant`   | `soft` (default), `filled`, `outline`, `ghost`   | Trigger look                                    |
| `data-size`      | `sm`, `md` (default), `lg`                       | Trigger size; the picker inherits the font size |
| `data-shape`     | `round` (default), `pill`, `square`              | Trigger, picker and option corners              |
| `data-tone`      | `grape` (default), `coral`, `mint`, `sky`, `sun` | Accent for this select only                     |
| `data-density`   | `comfortable` (default), `compact`, `roomy`      | Option spacing                                  |
| `data-columns`   | `2`, `3`                                         | Lay options out in columns                      |
| `data-checkmark` | `off`                                            | Hide the selected badge                         |
| `data-stagger`   | `off`                                            | Skip the `sibling-index()` entry animation      |

Option content: wrap an icon in `.rw-option__icon`, or initials in `.rw-option__avatar`, add a `<small>` description, and set `data-color` for a dot (typed `attr()`). Put `<legend>` inside an `optgroup` for a group heading, `<hr>` for a separator, and use `disabled` options normally. Add `<button><selectedcontent></selectedcontent></button>` first inside the select to mirror the chosen option (without its description) in the closed state. The Foundations / Controls / Select story exposes all of these as arguments.
