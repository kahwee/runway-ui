/** @import {HistoryAnnotation, HistoryOptions} from "./history.js" */
/**
 * @typedef {object} HistoryWindowFields
 * @property {(number | null)[]} values Every observation in time order; null marks a missing slot.
 * @property {string[]} labels One label per observation.
 * @property {HistoryAnnotation[]} [annotations] Indexes refer to the full series.
 * @property {number} [windowSize] Observations drawn at once, 1–366. Default 30.
 * @property {number[]} [windowSizes] Picker sizes. Default [7, 30, 90].
 * @property {number} [start] First visible index. Defaults to the latest window.
 * @property {number} [overviewBins] Whole-series overview bars. Default 120.
 * @property {(window: {start: number, size: number, end: number}) => void} [onChange]
 */
/** @typedef {Omit<HistoryOptions, "values" | "labels" | "annotations"> & HistoryWindowFields} HistoryWindowOptions */
/** @typedef {{readonly state: {start: number, size: number, end: number, total: number}, setWindow(start: number, size?: number): void, destroy(): void}} HistoryWindow */
/** Optional windowed time series. The host keeps every observation; only one window is drawn as columns. */
import { renderHistory } from "./history.js";

/** @type {Record<string, string>} */
const escapes = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
/** @param {unknown} value */
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => escapes[c]);
/** @type {Record<number, string>} */
const sizeNames = {
  7: "Week",
  14: "Fortnight",
  30: "Month",
  90: "Quarter",
  180: "Half year",
  365: "Year",
};
let sequence = 0;
// Overview bins are means of the real observations inside each bin; an all-missing bin stays missing.
/** @param {(number | null)[]} values @param {number} bins @param {number} minimum @param {number} range */
function overview(values, bins, minimum, range) {
  const count = Math.min(bins, values.length),
    out = [];
  for (let b = 0; b < count; b++) {
    const from = Math.floor((b * values.length) / count),
      to = Math.floor(((b + 1) * values.length) / count);
    let sum = 0,
      n = 0;
    for (let i = from; i < to; i++)
      if (values[i] !== null) {
        sum += /** @type {number} */ (values[i]);
        n++;
      }
    out.push(n ? ((sum / n - minimum) / range) * 100 : null);
  }
  return out;
}
/** @param {Element} root @param {HistoryWindowOptions} options @returns {HistoryWindow} */
export function mountHistoryWindow(
  root,
  {
    values = [],
    labels = [],
    windowSize = 30,
    windowSizes = [7, 30, 90],
    start,
    overviewBins = 120,
    annotations = [],
    onChange,
    ...history
  },
) {
  if (!(root instanceof Element)) throw new TypeError("Mount the time series into an element.");
  if (!Array.isArray(values) || !Array.isArray(labels) || labels.length !== values.length)
    throw new TypeError("Supply one label per observation.");
  const { minimum = 0, maximum = 100, unit = "units" } = history,
    range = maximum - minimum;
  if (
    !Number.isFinite(minimum) ||
    !Number.isFinite(maximum) ||
    !Number.isFinite(range) ||
    range <= 0 ||
    minimum > 0 ||
    maximum < 0
  )
    throw new RangeError("History scale must have a finite positive range.");
  if (
    values.some(
      (value) =>
        value !== null &&
        (typeof value !== "number" ||
          !Number.isFinite(value) ||
          value < minimum ||
          value > maximum),
    )
  )
    throw new RangeError("History values must be finite and in scale, or null.");
  if (labels.some((label) => typeof label !== "string" || !label.trim()))
    throw new TypeError("Supply one nonempty label per observation.");
  if (!Number.isInteger(overviewBins) || overviewBins < 1)
    throw new RangeError("Overview bins must be a positive integer.");
  if (start !== undefined && (!Number.isInteger(start) || start < 0))
    throw new RangeError("Window start must be a non-negative integer.");
  if (
    annotations.some(
      (note) => !Number.isInteger(note.index) || note.index < 0 || note.index >= values.length,
    )
  )
    throw new RangeError("Annotation indexes must refer to observations.");
  const sizes = [...new Set(windowSizes.concat(windowSize))]
    .filter((s) => Number.isInteger(s) && s >= 1 && s <= 366)
    .sort((a, b) => a - b);
  if (!sizes.includes(windowSize))
    throw new RangeError("Window size must be an integer from 1 to 366.");
  const id = `rw-timeline-${++sequence}`,
    total = values.length,
    bars = overview(values, Math.max(1, overviewBins), minimum, range);
  const abort = new AbortController(),
    { signal } = abort;
  let size = Math.min(windowSize, total),
    from = Math.max(0, Math.min(total - size, start ?? total - size)),
    frame = 0,
    destroyed = false;
  const fmt = new Intl.NumberFormat();
  root.innerHTML = `<div class="rw-timeline"><div class="rw-timeline__chart"></div>
<div class="rw-timeline__nav"><button type="button" class="rw-button" data-size="sm" data-step="-1"><span class="rw-icon" data-icon="arrow-left" aria-hidden="true"></span> Earlier</button><button type="button" class="rw-button" data-size="sm" data-step="1">Later <span class="rw-icon" data-icon="arrow-right" aria-hidden="true"></span></button><label class="rw-timeline__size">Window <select class="rw-input">${sizes.map((s) => `<option value="${s}"${s === size ? " selected" : ""}>${sizeNames[s] ?? `${s} days`} · ${s}</option>`).join("")}</select></label><output class="rw-timeline__status" role="status" aria-live="polite"></output></div>
<div class="rw-timeline__overview"><ol class="rw-spark" role="list" aria-hidden="true" style="--rw-chart-max:100">${bars.map((v) => (v === null ? "<li data-missing></li>" : `<li style="--rw-amount:${v.toFixed(2)}"></li>`)).join("")}</ol><span class="rw-timeline__window" aria-hidden="true"></span><input type="range" id="${id}-start" aria-label="Window start, observation" min="0" step="1"></div>
<p class="rw-timeline__note">Overview: ${fmt.format(total)} observations averaged into ${bars.length} bars on the full ${esc(unit)} scale. The chart above draws real observations only.</p></div>`;
  /** @template {Element} T @param {string} s @returns {T} */
  const $ = (s) => {
    const element = root.querySelector(s);
    if (!element) throw new Error(`Missing timeline element: ${s}`);
    return /** @type {T} */ (element);
  };
  const chart = $(".rw-timeline__chart"),
    status = $(".rw-timeline__status"),
    win = /** @type {HTMLElement} */ ($(".rw-timeline__window")),
    scrub = /** @type {HTMLInputElement} */ ($("input[type=range]")),
    pick = /** @type {HTMLSelectElement} */ ($("select"));
  function draw() {
    frame = 0;
    if (destroyed) return;
    const to = from + size,
      open = chart.querySelector("details")?.open ?? history.tableOpen;
    const notes = annotations
      .filter((a) => a.index >= from && a.index < to)
      .map((a) => ({ ...a, index: a.index - from }));
    chart.innerHTML = renderHistory({
      ...history,
      unit: `${unit} · ${esc(labels[from])} – ${esc(labels[to - 1])}`.replace(/&amp;/g, "&"),
      values: values.slice(from, to),
      labels: labels.slice(from, to),
      annotations: notes,
      tableOpen: open,
    });
    status.textContent = total
      ? `Observations ${fmt.format(from + 1)}–${fmt.format(to)} of ${fmt.format(total)}`
      : "No observations";
    win.style.cssText = `--rw-start:${total ? (from / total) * 100 : 0}%;--rw-size:${total ? Math.max((size / total) * 100, 0.8) : 100}%`;
    scrub.max = String(Math.max(0, total - size));
    scrub.value = String(from);
    scrub.disabled = total === 0;
    pick.disabled = total === 0;
    /** @type {HTMLButtonElement} */ ($('[data-step="-1"]')).disabled = from === 0;
    /** @type {HTMLButtonElement} */ ($('[data-step="1"]')).disabled = to >= total;
    onChange?.({ start: from, size, end: to });
  }
  const schedule = () => {
    if (!destroyed && !frame) frame = requestAnimationFrame(draw);
  };
  /** @param {number} next */
  const move = (next) => {
    const clamped = Math.max(0, Math.min(total - size, next));
    if (clamped !== from) {
      from = clamped;
      schedule();
    }
  };
  root.addEventListener(
    "click",
    (event) => {
      if (!(event.target instanceof Element)) return;
      const b = /** @type {HTMLButtonElement | null} */ (event.target.closest("button[data-step]"));
      if (b && root.contains(b)) move(from + Number(b.dataset.step) * size);
    },
    { signal },
  );
  scrub.addEventListener("input", () => move(Number(scrub.value)), { signal });
  pick.addEventListener(
    "change",
    () => {
      const center = from + size / 2;
      size = Math.min(Number(pick.value), total);
      from = Math.max(0, Math.min(total - size, Math.round(center - size / 2)));
      schedule();
    },
    { signal },
  );
  draw();
  return {
    get state() {
      return { start: from, size, end: from + size, total };
    },
    /** @param {number} nextStart @param {number} [nextSize] */
    setWindow(nextStart, nextSize = size || windowSize) {
      if (destroyed) return;
      if (
        !Number.isInteger(nextStart) ||
        nextStart < 0 ||
        !Number.isInteger(nextSize) ||
        nextSize < 1 ||
        nextSize > 366
      )
        throw new RangeError(
          "Supply a non-negative integer start and a window size from 1 to 366.",
        );
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      size = Math.min(nextSize, total);
      from = Math.max(0, Math.min(total - size, nextStart));
      draw();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      abort.abort();
      if (frame) cancelAnimationFrame(frame);
      root.replaceChildren();
    },
  };
}
