import { catalog } from './catalog.js';
import { bindDialog } from '../behaviors/dialog.js';
const $ = selector => document.querySelector(selector);
const dialog = $('#policy-dialog');
const modal = bindDialog(dialog, { canDismiss: () => !$('#locked').checked });
const preview = $('#preview');
const previewButton = $('#preview-action');
const controls = $('#options');
const cards = [];

function update() {
  const theme = $('#theme').value, density = $('#density').value;
  const variant = $('#variant').value, size = $('#size').value;
  const disabled = $('#disabled').checked, block = $('#block').checked;
  const elevation = $('#elevation').value, locked = $('#locked').checked;
  preview.dataset.theme = theme; preview.dataset.density = density;
  dialog.dataset.theme = theme; dialog.dataset.density = density;
  previewButton.dataset.variant = variant; previewButton.dataset.size = size;
  previewButton.disabled = disabled; previewButton.toggleAttribute('data-block', block);
  $('#preview-panel').dataset.elevation = elevation;
  $('#policy-description').textContent = locked ? 'An explicit choice is required.' : 'Escape and backdrop can dismiss.';
  $('#dialog-description').textContent = locked
    ? 'Escape and backdrop dismissal are blocked. Choose Cancel decision or Confirm expedition.'
    : 'You can dismiss this optional decision with Escape, the backdrop or a decision button.';
  $('#dialog-lock').checked = locked;
  modal.refresh();
  $('#recipe').textContent = `<section class="g-ui g-panel" data-theme="${theme}"\n  data-density="${density}" data-elevation="${elevation}">\n  <button type="button" class="g-button"\n    data-variant="${variant}" data-size="${size}"${block ? ' data-block' : ''}${disabled ? ' disabled' : ''}>\n    Plan expedition →\n  </button>\n</section>`;
}
controls.addEventListener('change', update);
controls.addEventListener('submit', event => event.preventDefault());
controls.addEventListener('reset', () => requestAnimationFrame(update));
$('#dialog-lock').addEventListener('change', event => { $('#locked').checked = event.target.checked; update(); });
$('#open-dialog').addEventListener('click', () => modal.open());
previewButton.addEventListener('click', () => { $('#action-status').textContent = 'Preview action activated. Your application supplies the real effect.'; });
dialog.addEventListener('close', () => { $('#action-status').textContent = `Dialog closed${dialog.returnValue ? ` with “${dialog.returnValue}”` : ''}.`; });

async function copy(text, status) {
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = 'Copied. Paste into a g-ui root in your application.';
  } catch {
    status.textContent = 'Clipboard access is unavailable. Select and copy the code directly.';
  }
}
$('#copy-recipe').addEventListener('click', () => copy($('#recipe').textContent, $('#copy-status')));
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
for (const entry of catalog) {
  const article = element('article', undefined, 'g-panel reference-card');
  article.id = `component-${entry.id}`;
  const header = element('div', undefined, 'g-row');
  const heading = element('h3', entry.name);
  heading.id = `${article.id}-title`;
  article.setAttribute('aria-labelledby', heading.id);
  const link = element('a', '#'); link.href = `#${article.id}`; link.setAttribute('aria-label', `Link to ${entry.name}`);
  header.append(heading, link);
  article.append(header, element('p', entry.description, 'g-muted'));
  const table = element('table', undefined, 'reference-table');
  table.append(element('caption', `${entry.name} options`));
  const thead = element('thead'), headerRow = element('tr');
  for (const title of ['Option', 'Values / type', 'Default & contract']) {
    const th = element('th', title); th.scope = 'col'; headerRow.append(th);
  }
  thead.append(headerRow); table.append(thead);
  const tbody = element('tbody');
  for (const [name, value, detail] of entry.options) {
    const row = element('tr'), label = element('th'); label.scope = 'row'; label.append(element('code', name));
    const values = element('td'); values.append(element('code', value));
    row.append(label, values, element('td', detail)); tbody.append(row);
  }
  table.append(tbody); article.append(table);
  const details = element('details', undefined, 'g-disclosure');
  details.append(element('summary', 'Markup / usage'));
  const pre = element('pre'); pre.append(element('code', entry.snippet)); details.append(pre);
  const status = element('p', '', 'g-muted'); status.setAttribute('role', 'status');
  const button = element('button', 'Copy example', 'g-button'); button.type = 'button'; button.dataset.size = 'sm';
  button.addEventListener('click', () => copy(entry.snippet, status));
  details.append(button, status); article.append(details);
  $('#catalog').append(article);
  cards.push({ article, search: `${entry.name} ${entry.description} ${entry.options.flat().join(' ')}`.toLowerCase() });
}
function search() {
  const query = $('#search').value.trim().toLowerCase();
  let count = 0;
  for (const card of cards) { card.article.hidden = !card.search.includes(query); if (!card.article.hidden) count++; }
  $('#result-count').textContent = `${count} of ${cards.length} components`;
  $('#no-results').hidden = count !== 0;
}
$('#search').addEventListener('input', search);
update(); search();
