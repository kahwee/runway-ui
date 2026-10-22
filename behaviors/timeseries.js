/** Optional windowed time series. The host keeps every observation; only one window is drawn as columns. */
import { renderHistory } from './history.js';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sizeNames = { 7: 'Week', 14: 'Fortnight', 30: 'Month', 90: 'Quarter', 180: 'Half year', 365: 'Year' };
let sequence = 0;
// Overview bins are means of the real observations inside each bin; an all-missing bin stays missing.
function overview(values, bins, minimum, range) {
  const count = Math.min(bins, values.length), out = [];
  for (let b = 0; b < count; b++) {
    const from = Math.floor(b * values.length / count), to = Math.floor((b + 1) * values.length / count);
    let sum = 0, n = 0;
    for (let i = from; i < to; i++) if (values[i] !== null) { sum += values[i]; n++; }
    out.push(n ? ((sum / n) - minimum) / range * 100 : null);
  }
  return out;
}
export function mountHistoryWindow(root, { values = [], labels = [], windowSize = 30, windowSizes = [7, 30, 90], start, overviewBins = 120, annotations = [], onChange, ...history } = {}) {
  if (!(root instanceof Element)) throw new TypeError('Mount the time series into an element.');
  if (!Array.isArray(values) || !Array.isArray(labels) || labels.length !== values.length) throw new TypeError('Supply one label per observation.');
  const { minimum = 0, maximum = 100, unit = 'units' } = history, range = maximum - minimum;
  if (!Number.isFinite(range) || range <= 0) throw new RangeError('History scale must have a finite positive range.');
  const sizes = [...new Set(windowSizes.concat(windowSize))].filter(s => Number.isInteger(s) && s >= 1 && s <= 366).sort((a, b) => a - b);
  if (!sizes.includes(windowSize)) throw new RangeError('Window size must be an integer from 1 to 366.');
  const id = `rw-timeline-${++sequence}`, total = values.length, bars = overview(values, Math.max(1, overviewBins), minimum, range);
  const abort = new AbortController(), { signal } = abort;
  let size = Math.min(windowSize, Math.max(1, total)), from = Math.max(0, Math.min(total - size, start ?? total - size)), frame = 0;
  const fmt = new Intl.NumberFormat();
  root.innerHTML = `<div class="rw-timeline"><div class="rw-timeline__chart"></div>
<div class="rw-timeline__nav"><button type="button" class="rw-button" data-size="sm" data-step="-1"><span class="rw-icon" data-icon="arrow-left" aria-hidden="true"></span> Earlier</button><button type="button" class="rw-button" data-size="sm" data-step="1">Later <span class="rw-icon" data-icon="arrow-right" aria-hidden="true"></span></button><label class="rw-timeline__size">Window <select class="rw-input">${sizes.map(s => `<option value="${s}"${s === size ? ' selected' : ''}>${sizeNames[s] ?? `${s} days`} · ${s}</option>`).join('')}</select></label><output class="rw-timeline__status" role="status" aria-live="polite"></output></div>
<div class="rw-timeline__overview"><ol class="rw-spark" role="list" aria-hidden="true" style="--rw-chart-max:100">${bars.map(v => v === null ? '<li data-missing></li>' : `<li style="--rw-amount:${v.toFixed(2)}"></li>`).join('')}</ol><span class="rw-timeline__window" aria-hidden="true"></span><input type="range" id="${id}-start" aria-label="Window start, observation" min="0" step="1"></div>
<p class="rw-timeline__note">Overview: ${fmt.format(total)} observations averaged into ${bars.length} bars on the full ${esc(unit)} scale. The chart above draws real observations only.</p></div>`;
  const $ = s => root.querySelector(s), chart = $('.rw-timeline__chart'), status = $('.rw-timeline__status'), win = $('.rw-timeline__window'), scrub = $('input[type=range]'), pick = $('select');
  function draw() {
    frame = 0;
    const to = from + size, open = chart.querySelector('details')?.open ?? history.tableOpen;
    const notes = annotations.filter(a => a.index >= from && a.index < to).map(a => ({ ...a, index: a.index - from }));
    chart.innerHTML = renderHistory({ ...history, unit: `${unit} · ${esc(labels[from])} – ${esc(labels[to - 1])}`.replace(/&amp;/g, '&'), values: values.slice(from, to), labels: labels.slice(from, to), annotations: notes, tableOpen: open });
    status.textContent = `Observations ${fmt.format(from + 1)}–${fmt.format(to)} of ${fmt.format(total)}`;
    win.style.cssText = `--rw-start:${from / total * 100}%;--rw-size:${Math.max(size / total * 100, 0.8)}%`;
    scrub.max = String(Math.max(0, total - size)); scrub.value = String(from);
    $('[data-step="-1"]').disabled = from === 0; $('[data-step="1"]').disabled = to >= total;
    onChange?.({ start: from, size, end: to });
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
  const move = next => { const clamped = Math.max(0, Math.min(total - size, next)); if (clamped !== from) { from = clamped; schedule(); } };
  root.addEventListener('click', event => { const b = event.target.closest('[data-step]'); if (b && root.contains(b)) move(from + Number(b.dataset.step) * size); }, { signal });
  scrub.addEventListener('input', () => move(Number(scrub.value)), { signal });
  pick.addEventListener('change', () => { const center = from + size / 2; size = Math.min(Number(pick.value), total); from = Math.max(0, Math.min(total - size, Math.round(center - size / 2))); schedule(); }, { signal });
  draw();
  return {
    get state() { return { start: from, size, end: from + size, total }; },
    setWindow(nextStart, nextSize = size) { size = Math.min(nextSize, total); from = Math.max(0, Math.min(total - size, nextStart)); draw(); },
    destroy() { abort.abort(); if (frame) cancelAnimationFrame(frame); root.replaceChildren(); },
  };
}
