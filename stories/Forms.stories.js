import { bindRanges } from '../behaviors/forms.js';
import { flag, range, select, text } from './helpers.js';
export default {
  title: 'Foundations/Forms',
  tags: ['autodocs'],
  args: { disabled: false, switchOn: true, sliderValue: 64, columns: 2, direction: 'ltr', invalid: false },
  argTypes: {
    disabled: flag('Disable the interactive controls.'),
    switchOn: flag('Initial state of the first switch.'),
    invalid: flag('Show native :user-invalid styling after interaction by prefilling a bad email.'),
    sliderValue: range(0, 100, 1, 'Initial native range value.', 'Content'),
    columns: range(1, 3, 1, 'Option card columns.'),
    direction: select(['ltr', 'rtl'], 'Text direction; switch thumbs and inputs use logical properties.'),
  },
  parameters: { docs: { description: { component: 'Native switch, slider, checkbox, radio, option cards, input groups and fields. Every control is a real form element; classes add the skin. Optional `bindRanges` mirrors slider values into an `<output>`.' } } },
};
export const Settings = {
  render: a => {
    const d = a.disabled ? ' disabled' : '';
    const root = document.createElement('div');
    root.innerHTML = `<form class="rw-layout" dir="${a.direction}" style="max-inline-size:900px" onsubmit="return false">
<div class="rw-panel rw-stack">
 <header class="rw-panel__header"><div><span class="rw-kicker">STUDIO SETTINGS</span><h2 class="rw-panel__title">Make it yours</h2></div><span class="rw-badge">Autosaved</span></header>
 <div class="rw-form-grid" style="--rw-form-columns:${a.columns > 1 ? 2 : 1}">
  <div class="rw-field"><label for="f-name">Workspace name</label><input class="rw-input" id="f-name" value="Moonbeam HQ" required${d}><small>Shown to everyone on the team.</small></div>
  <div class="rw-field"><label for="f-email">Invite email</label><input class="rw-input" id="f-email" type="email" required value="${a.invalid ? 'not-an-email' : 'friend@example.com'}"${d}><small>We only use this once.</small></div>
 </div>
 <div class="rw-input-group"><span dir="ltr">https://</span><input class="rw-input" aria-label="Subdomain" value="moonbeam"${d}><span dir="ltr">.example.app</span></div>
 <div class="rw-range-field"><label for="f-volume">Confetti intensity</label><output for="f-volume" id="f-volume-out">${a.sliderValue}</output><input class="rw-range" id="f-volume" type="range" min="0" max="100" value="${a.sliderValue}"${d}></div>
 <div class="rw-stack">
  <label class="rw-toggle" data-layout="row"><span>Sound effects<small>Tiny boops on every click.</small></span><input class="rw-switch" type="checkbox" role="switch"${a.switchOn ? ' checked' : ''}${d}></label>
  <label class="rw-toggle" data-layout="row"><span>Reduce motion<small>Calms springs and wiggles.</small></span><input class="rw-switch" type="checkbox" role="switch"${d}></label>
  <label class="rw-toggle" data-layout="row"><span>Beta features<small>Locked by your admin.</small></span><input class="rw-switch" type="checkbox" role="switch" disabled></label>
 </div>
 <fieldset class="rw-options" style="--rw-columns:${a.columns}"><legend class="rw-kicker">Pick a vibe</legend>
  <label class="rw-option"><input class="rw-check" type="radio" name="vibe" checked${d}><span><strong>Cozy</strong><small>Soft shadows, round corners.</small></span></label>
  <label class="rw-option"><input class="rw-check" type="radio" name="vibe"${d}><span><strong>Zippy</strong><small>Springy everything.</small></span></label>
  <label class="rw-option"><input class="rw-check" type="radio" name="vibe"${d}><span><strong>Calm</strong><small>Flat, quiet and focused.</small></span></label>
 </fieldset>
 <div class="rw-field"><label for="f-note">Notes for the team</label><textarea class="rw-input" id="f-note" placeholder="Grows as you type…"${d}></textarea><small>Textareas size to their content where the browser supports field-sizing.</small></div>
 <label class="rw-toggle"><input class="rw-check" type="checkbox" checked${d}><span>Send me the weekly digest</span></label>
 <label class="rw-toggle"><input class="rw-check" type="checkbox" id="f-all"${d}><span>Select everything (mixed)</span></label>
 <div class="rw-form-actions"><button type="reset" class="rw-button" data-variant="secondary">Reset</button><button type="submit" class="rw-button" data-variant="primary">Save changes</button></div>
</div></form>`;
    const indeterminate = root.querySelector('#f-all'); indeterminate.indeterminate = true;
    bindRanges(root, { format: v => `${v}%` });
    root.querySelector('#f-volume-out').value = `${a.sliderValue}%`;
    return root;
  },
};
