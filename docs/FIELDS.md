# Native fields with breathing room

```html
<label for="department">Department</label>
<select class="g-input" id="department">
  <option>Research & improbable inventions</option>
  <option>Operations & tea logistics</option>
</select>
```

A single-select gets `appearance:none`, a CSS-painted chevron inset 16px from its inline edge and 40px reserved end padding. Text cannot extend into the arrow gutter; short controls ellipsize long options. `dir="rtl"` flips the arrow and reserved padding. No wrapper, icon font, script or external image is required. Keep an associated label. The selected option and keyboard interaction remain native. `multiple` and `size` greater than 1 retain native listbox appearance and have no dropdown arrow.

Tune `--g-select-inset` to change the edge distance. The text gutter follows it automatically. Comfortable and compact density both retain a comfortable arrow inset. Do not apply host `background` or `padding` shorthands over the shared field recipe: use tokens and layout classes instead.

For existing forms, place `g-native` on a container inside a `g-ui` root. The full bundle includes this opt-in skin. The `native.css` entry imports the same tokens, controls and fields when only form styling is needed. It no longer maintains a second button/field implementation.

## Progressive native picker

```html
<select class="g-input" data-picker="enhanced" aria-label="Priority">
  <option>Proceed with cheerful caution</option>
  <option>After tea</option>
</select>
```

Inside `@supports (appearance:base-select)`, both the select and `::picker(select)` opt into native customizable rendering. The picker receives themed options, spacing and selection styling; `::picker-icon` remains at the end with its own gap. Other browsers use the padded native dropdown above. This is opt-in because support is still evolving. Reference: [MDN customizable select elements](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select).

Use `disabled`, `required`, `aria-invalid` and associated help/error text normally. Forced colors restores the native arrow; reduced motion disables picker-icon and control transitions. These accommodations do not establish assistive-technology conformance.

The [Clipboard Club example](../examples/controls.html) compares long labels, disabled/invalid states, RTL and listboxes. Storybook's Select playground exposes content, width, arrow inset, direction, state, skin and picker mode.
