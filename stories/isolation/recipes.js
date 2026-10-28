/** Documentation recipes shared by isolated stories and the generated dependency guide. */
const tokens = "styles/tokens.css";
const buttons = `<button type="button" class="rw-button" aria-pressed="true">Build <kbd class="rw-shortcut">B</kbd></button>
<button type="button" class="rw-button" aria-pressed="false">Inspect <kbd class="rw-shortcut">I</kbd></button>
<button type="button" class="rw-button" disabled>Unavailable</button>`;
export const recipes = {
  controls: {
    title: "Standalone controls",
    styles: [tokens, "styles/controls.css"],
    markup: `<div style="display:flex;gap:16px;align-items:center">${buttons}</div>`,
    note: "Native buttons need no behavior module. Shortcut hints do not bind keys; toggle state is application-owned.",
  },
  panels: {
    title: "Standalone panels",
    styles: [tokens, "styles/panels.css"],
    markup: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px"><section class="rw-panel"><header class="rw-panel__header"><h2 class="rw-panel__title">Raised panel</h2><span>Overview</span></header><p>Independent surface and header.</p><button type="button" class="rw-button">Control intentionally unstyled</button></section><section class="rw-panel" data-elevation="flat"><h2 class="rw-panel__title">Flat panel</h2><p>No composition dependencies.</p></section></div>`,
    note: "Panels do not style child controls. Add controls.css or fields.css when those components are used.",
  },
  dock: {
    title: "Dock composition",
    styles: [
      tokens,
      "styles/controls.css",
      "styles/patterns/dock.css",
      "styles/patterns/accessibility.css",
    ],
    markup: `<div class="rw-dock" role="group" aria-label="Workspace actions">${buttons}</div>`,
    note: "Controls own pressed colors and shortcut hints; the dock adds arrangement and motion. The accessibility entry provides reduced-motion rules.",
  },
  fields: {
    title: "Standalone fields",
    styles: [tokens, "styles/fields.css"],
    markup: `<div style="display:grid;gap:16px;max-inline-size:600px"><label>Workspace name <input class="rw-input" id="workspace-name" value="Northwind"></label><label>Region <select class="rw-input" id="region"><option>Coast</option><option>Highlands</option></select></label><label>Notes <textarea class="rw-input" rows="2">Ready to begin.</textarea></label><label>Invalid code <input class="rw-input" aria-invalid="true" aria-describedby="code-error" value="???"></label><small id="code-error">Use a valid workspace code.</small><label>Unavailable <input class="rw-input" disabled value="Locked"></label></div>`,
    note: "Inputs, selects and textareas use native editing and validation. Modern select pickers enhance supported browsers; native controls remain the fallback. Field wrapper layouts belong to forms.css.",
  },
  forms: {
    title: "Form controls and layout",
    styles: [tokens, "styles/icons.css", "styles/fields.css", "styles/forms.css"],
    markup: `<form style="max-inline-size:650px"><fieldset class="rw-fieldset"><legend>Workspace preferences</legend><div class="rw-field"><label for="team-name">Team name</label><input class="rw-input" id="team-name" name="team" required value="Northwind"></div><label class="rw-toggle"><input type="checkbox" class="rw-switch" name="alerts" checked role="switch">Enable alerts</label><label><input type="checkbox" class="rw-check" name="reports" checked> Weekly report</label><label><input type="radio" class="rw-check" name="pace" value="steady" checked> Steady pace</label><label for="capacity">Capacity</label><input class="rw-range" id="capacity" type="range" min="0" max="100" value="50" style="--rw-fill:50%"></fieldset></form>`,
    note: "icons.css supplies checkbox check and minus masks. fields.css styles text inputs; forms.css supplies wrappers, switches, checks, radios, ranges and choice cards. Add controls.css for styled submit buttons. Optional runway-ui/forms binds range output and fill updates; retain its handle and destroy it on unmount. This fixture uses a fixed fill value and native inputs only.",
  },
  viewNavigation: {
    title: "View navigation",
    styles: [tokens, "styles/patterns/view-tabs.css"],
    markup: `<nav class="rw-view-tabs" aria-label="Workspace views"><a class="rw-view-tab" href="#overview" aria-current="page"><span>Overview</span></a><a class="rw-view-tab" href="#people"><span>People</span></a><a class="rw-view-tab" href="#projects"><span>Projects</span></a></nav><p id="overview">Overview destination</p><p id="people">People destination</p><p id="projects">Projects destination</p>`,
    note: "Links keep native focus and navigation; view-tabs.css includes its own reduced-motion and forced-color rules. Artwork is optional and host-owned. Routing and aria-current updates belong to the application; no behavior module is required for links.",
  },
  sectionNavigation: {
    title: "Section navigation",
    styles: [tokens, "styles/controls.css", "styles/patterns/section-tabs.css"],
    markup: `<nav class="rw-section-tabs" aria-label="Workspace sections"><a class="rw-button" href="#production">Production</a><a class="rw-button" href="#reserves">Reserves</a></nav><p id="production">Production destination</p><p id="reserves">Reserves destination</p>`,
    note: "section-tabs.css supplies the container; controls.css supplies the button appearance and focus rules. Links need no script. For application-owned toggle buttons, update aria-pressed and displayed content together. Optional runway-ui/navigation provides roving focus, not routing.",
  },
  charts: {
    title: "CSS columns and table bars",
    styles: [tokens, "styles/charts.css"],
    markup: `<figure class="rw-figure" style="max-inline-size:650px;--rw-chart-max:100;--rw-chart-height:120px"><figcaption>Monthly output <small>Units; scale 0–100</small></figcaption><ol class="rw-columns"><li><span class="rw-column-track"><i class="rw-column-mark" style="--rw-amount:25"></i></span><strong>25</strong><span class="rw-category">Jan</span></li><li><span class="rw-column-track"><i class="rw-column-mark" style="--rw-amount:75"></i></span><strong>75</strong><span class="rw-category">Feb</span></li></ol></figure><table class="rw-chart" style="max-inline-size:650px;margin-block-start:24px"><caption>Exact output · units</caption><thead><tr><th scope="col">Month</th><th scope="col">Share of scale</th><th scope="col">Units</th></tr></thead><tbody><tr><th scope="row">Jan</th><td class="rw-chart__axis"><span class="rw-chart__plot" style="--rw-value:25%"></span></td><td>25</td></tr><tr><th scope="row">Feb</th><td class="rw-chart__axis"><span class="rw-chart__plot" style="--rw-value:75%"></span></td><td>75</td></tr></tbody></table>`,
    note: "CSS draws marks without JavaScript, panels or icons. Column amounts are numbers on the declared positive maximum; table bars use percentage values. Labels and exact values remain readable HTML. The same entry contains stacked, diverging and area primitives; see CHARTS.md for their data contracts.",
  },
  dialogs: {
    title: "Native dialog",
    styles: ["styles/tokens.css", "styles/controls.css", "styles/dialog.css"],
    markup:
      '<button class="rw-button" commandfor="isolated-dialog" command="show-modal">Open decision</button><dialog class="rw-dialog" id="isolated-dialog" aria-labelledby="decision-title"><header class="rw-dialog__header"><h2 class="rw-dialog__title" id="decision-title">Ready to begin?</h2></header><div class="rw-dialog__body"><p>Review the expedition before continuing.</p></div><form method="dialog" class="rw-dialog__footer"><button class="rw-button" value="cancel" autofocus>Cancel</button><button class="rw-button" value="confirm">Confirm</button></form></dialog>',
    note: 'dialog.css owns the surface; controls.css styles the buttons. Native showModal(), close() and method="dialog" provide modality and results. Invoker commands require browser support; older hosts can call showModal() from their event handler. Optional runway-ui/dialog adds dismissal policy and requires explicit teardown.',
  },
  disclosures: {
    title: "Native disclosure",
    styles: [
      "styles/tokens.css",
      "styles/controls.css",
      "styles/icons.css",
      "styles/disclosure.css",
    ],
    markup:
      '<details class="rw-disclosure"><summary>Expedition details</summary><div><p>Three crew members and one supply crate.</p><a href="#supplies">Review supplies</a></div></details><p id="supplies">Supplies are ready.</p>',
    note: "disclosure.css supplies the native details surface and motion; icons.css supplies its caret mask. controls.css supplies the shared summary focus ring. Opening and closing require no JavaScript.",
  },
  resources: {
    title: "Resource display",
    styles: ["styles/tokens.css", "styles/icons.css", "styles/patterns/resource.css"],
    markup:
      '<div class="rw-resource"><span class="rw-resource__icon rw-icon" data-icon="package" aria-hidden="true"></span><div><strong>2,840</strong><small>Supplies available</small></div></div>',
    note: "resource.css owns the value, label and spacing. Icons are optional; this fixture includes icons.css for the package mark. Values and updates belong to the host; no behavior module is required.",
  },
  inventory: {
    title: "Inventory slots",
    styles: [
      "styles/tokens.css",
      "styles/controls.css",
      "styles/patterns/inventory.css",
      "styles/patterns/accessibility.css",
    ],
    markup:
      '<div class="rw-slots" role="group" aria-label="Equipment"><button type="button" class="rw-slot" aria-pressed="true"><strong>Compass</strong><small>Selected</small></button><button type="button" class="rw-slot" aria-pressed="false"><strong>Lantern</strong><small>Available</small></button><button type="button" class="rw-slot" disabled><strong>Supply pack</strong><small>Unavailable</small></button></div>',
    note: "inventory.css supplies slots and selection appearance. controls.css supplies shared focus and disabled rules; accessibility.css supplies reduced-motion rules. Selection is application-owned. Optional runway-ui/inventory provides fixed-height virtual inventories, and runway-ui/navigation supplies roving focus; destroy their handles on unmount.",
  },
};
