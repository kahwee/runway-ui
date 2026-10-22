/** Documentation data; not imported by the runtime package. */
export const catalog = [
  { id:'button', name:'Button', description:'Native actions with explicit size, variant and state.', options:[
    ['data-variant','primary | secondary | danger','Default: neutral. Changes color roles, not meaning or behavior.'],
    ['data-size','sm | md | lg','Default: md. Explicit sm/lg overrides density for this button.'],
    ['data-block','present / absent','Presence makes the button fill its available inline width.'],
    ['disabled','native boolean','Prevents native activation. Prefer this to aria-disabled on buttons.'],
    ['aria-pressed','true | false','Use only for toggle actions; your app owns the value.'],
    ['aria-busy','true | false','Busy cursor only; does not disable activation. Pair with disabled if needed.'],
  ], snippet:'<button type="button" class="rw-button"\n  data-variant="primary" data-size="md">Launch</button>' },
  { id:'panel', name:'Panel', description:'A labeled surface; layout and semantics remain native HTML.', options:[
    ['data-elevation','raised | flat','Default: raised. Flat removes the shadow.'],
    ['--rw-panel-padding','CSS length','Default: 22px, or 16px in compact density.'],
  ], snippet:'<section class="rw-panel" data-elevation="flat" aria-labelledby="heading">\n  <h2 id="heading">Production</h2>\n</section>' },
  { id:'input', name:'Input', description:'Style native input, select or textarea elements.', options:[
    ['--rw-select-inset','CSS length','Default: 16px arrow inset, with a separate text gutter; RTL-aware.'],['data-picker','native','Opt out of the default customizable picker; otherwise the padded native dropdown.'],['disabled','native boolean','Retains native disabled semantics.'],['readonly','native boolean','For supported input/textarea types.'],
    ['aria-invalid','true | false','Apply after validation, alongside an associated text error.'],
    ['aria-describedby','element ID','Connect hint or validation text; never rely on color alone.'],
  ], snippet:'<label for="colony">Colony name</label>\n<input class="rw-input" id="colony" aria-describedby="hint">\n<small id="hint">Use a name your crew will recognize.</small>' },
  { id:'badge', name:'Badge', description:'A short status label that remains understandable without color.', options:[
    ['data-tone','warning | danger','Default: neutral/accent. Always include meaningful text.'],
  ], snippet:'<span class="rw-badge" data-tone="warning">Low reserves</span>' },
  { id:'meter', name:'Progress', description:'Visible text, ARIA value and painted fill must agree.', options:[
    ['data-tone','warning | danger | design | pm | energy | morale','Default: accent. Domain tones remain supported for compatibility.'],
    ['--rw-value','0%–100%','Host supplies the percentage; CSS bounds the painted fill.'],
    ['--rw-meter-height','CSS length','Default: 6px.'],['--rw-meter-color','CSS color','Optional override of the semantic tone.'],
  ], snippet:'<div class="rw-meter">\n  <div class="rw-meter__label"><span>Readiness</span><span>68%</span></div>\n  <div class="rw-meter__track" role="progressbar" aria-label="Readiness"\n    aria-valuenow="68" aria-valuemin="0" aria-valuemax="100">\n    <div class="rw-meter__fill" style="--rw-value:68%"></div>\n  </div>\n</div>' },
  { id:'dialog', name:'Dialog', description:'A native modal with an optional dismissal-policy adapter.', options:[
    ['--rw-dialog-width','CSS length','Default: 520px, bounded by the viewport.'],
    ['rw-dialog--compact / --wide','CSS classes','380px / 760px preferred width.'],
    ['rw-dialog--danger','CSS class','Danger border and eyebrow; pair with a danger action.'],
    ['rw-dialog__header / __body / __footer','CSS classes','Explicit content structure, scrollable body and action layout.'],
    ['canDismiss','() => boolean','Default: true. Read on every request; refresh() updates closedby.'],
    ['open()','method','Uses showModal(); calling again refreshes policy without reopening.'],
    ['refresh()','method','Updates the native closedby attribute after application policy changes.'],
    ['requestClose(value?)','method → boolean','True: a request was issued. A cancel listener may still prevent closing.'],
    ['destroy()','method','Idempotent. Restores closedby; does not close the native dialog.'],
  ], snippet:'<dialog class="rw-ui rw-dialog" aria-labelledby="title">\n  <h2 id="title">Start the expedition?</h2>\n  <form method="dialog">\n    <button class="rw-button" value="cancel">Cancel</button>\n  </form>\n</dialog>' },
  { id:'navigation', name:'Keyboard navigation', description:'Roving focus for button groups; selection belongs to your application.', options:[
    ['selector','CSS selector','Default: button. Use focusable controls; text-editing keys are left alone.'],
    ['columns','positive integer | function','Default: 1. Moves through enabled-item order, not spatial coordinates.'],
    ['wrap','boolean','Default: true. False clamps movement to the first/last item.'],
    ['refresh()','method → HTMLElement[]','Call after adding, removing, hiding or disabling candidates.'],
    ['move(direction)','method','left, right, up, down, first, last.'],
    ['activate()','method','Clicks the current eligible action.'],
    ['destroy()','method','Restores tabindex; repeated calls and calls after destroy are harmless.'],
  ], snippet:"import { bindNavigation } from 'runway-ui/navigation';\nconst nav = bindNavigation(toolbar, { columns:3, wrap:false });\n// On unmount: nav.destroy();" },
  { id:'inventory', name:'Virtual inventory', description:'Fixed-height indexed rows with bounded DOM rendering.', options:[
    ['items','Iterable<{ label: string, icon?: string }>','Required. Extra item properties pass through to onSelect.'],
    ['columns','positive integer','Default: 6.'],['rowHeight','finite number ≥32','Default: 92px; also sets the CSS row/cell sizing.'],
    ['overscan','non-negative integer','Default: 1 extra row on each side of the viewport.'],
    ['onSelect','(item, index) => void','Default: no-op. Index is relative to the current items.'],
    ['setItems(next)','method','Resets selection and scroll; preserves focus if it was inside the grid.'],
    ['move(direction)','method','Directions above plus pageup and pagedown; navigates unmounted rows.'],
    ['destroy()','method','Clears owned children, disconnects observer and restores root attributes/styles.'],
  ], snippet:"import { createInventory } from 'runway-ui/inventory';\nconst grid = createInventory(root, {\n  items, columns:8, rowHeight:64, overscan:1,\n  onSelect(item) { showItem(item); }\n});\n// grid.setItems(filteredItems);\n// On unmount: grid.destroy();" },
  { id:'ledger', name:'Production ledger', description:'Subgrid keeps labels and values aligned across rows.', options:[
    ['grid-template-columns','CSS track list on .rw-ledger','Default: one flexible label column and three value columns.'],
    ['role / headers','native table or ARIA table semantics','Supply meaningful row/column labels. See the markup guide.'],
  ], snippet:'<div class="rw-ledger" role="table" aria-label="Production">\n  <div class="rw-ledger__row" role="row">\n    <strong role="rowheader">Oxygen</strong><span role="cell">120</span>\n    <span role="cell">24</span><span role="cell">18</span>\n  </div>\n</div>' },
  { id:'chart', name:'CSS charts', description:'Columns, stacked and diverging bars, six-point areas and percentage-based horizontal table bars. Open the CSS chart lab for the full collection.', options:[
    ['--rw-value','percentage','Host maps the quantity to the scale declared in the caption.'],
    ['--rw-chart-max','Positive number','Shared maximum for numeric chart marks; default 100.'],['--rw-amount / data-value','Number','Numeric mark input, distinct from percentage-based --rw-value inputs.'],['--rw-chart-height','CSS length','Plot height; default 180px.'],['--rw-chart-color','CSS color','Default: accent.'],['data-series','expense','Optional row/element tone using the gold token.'],
  ], snippet:'<table class="rw-chart">\n  <caption>Oxygen · scale 0–300 units</caption>\n  <tbody><tr><th scope="row">Cycle 1</th>\n    <td><span class="rw-chart__plot" style="--rw-value:40%" aria-hidden="true"></span></td>\n    <td>120</td>\n  </tr></tbody>\n</table>' },
  { id:'slot', name:'Equipment slot', description:'A native toggle action with an optional visible rarity label.', options:[
    ['aria-pressed','true | false','Application-owned selection; not changed by CSS or roving focus.'],
    ['data-rarity','rare','Adds a visual Rare label. Include rarity in the accessible name when meaningful.'],
    ['--rw-columns','positive integer on .rw-slots','Default: 4.'],
  ], snippet:'<button type="button" class="rw-slot" aria-pressed="false"\n  aria-label="Portable terminal, rare" data-rarity="rare">\n  <span class="rw-slot__icon" aria-hidden="true">▰</span>\n  <small>Portable terminal</small>\n</button>' },
  { id:'patterns', name:'Resources, objectives & choices', description:'Small compositions over native HTML.', options:[
    ['.rw-resource','resource HUD item','Keep quantity, unit and rate visible.'],
    ['.rw-objectives li[data-complete]','true | false','Completed items change appearance; supply a textual status too.'],
    ['.rw-choice','button','Cost and consequence remain visible before activation.'],
    ['.rw-dock','button group','Supply a navigation/toolbar label; optional roving focus never supplies ARIA roles.'],
  ], snippet:'<button type="button" class="rw-choice">\n  <span><strong>Upgrade oxygen production</strong>\n  <small>+6 units per cycle</small></span>\n  <span>200 credits</span>\n</button>' },
];
