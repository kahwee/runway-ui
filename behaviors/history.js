/** Optional HTML renderer. CSS owns geometry; callers own observations and units. */
const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
let sequence = 0;
export function renderHistory({
  title = "History",
  unit = "units",
  values = [],
  labels = [],
  minimum = 0,
  maximum = 100,
  height = 150,
  annotations = [],
  format = (value) => String(value),
  axisFormat = format,
  exactFormat = format,
  tableOpen = false,
  detail = "auto",
} = {}) {
  if (
    !Number.isFinite(minimum) ||
    !Number.isFinite(maximum) ||
    maximum <= minimum ||
    !Number.isFinite(maximum - minimum) ||
    minimum > 0 ||
    maximum < 0
  )
    throw new RangeError("History scale must be finite, span zero and have a positive range.");
  if (
    !Array.isArray(values) ||
    values.length > 366 ||
    values.some(
      (v) =>
        v !== null && (typeof v !== "number" || !Number.isFinite(v) || v < minimum || v > maximum),
    )
  )
    throw new RangeError("Supply up to 366 finite in-scale values; null means missing.");
  if (
    !Array.isArray(labels) ||
    labels.length !== values.length ||
    labels.some((label) => typeof label !== "string" || !label.trim())
  )
    throw new TypeError("Supply one label per history observation.");
  if (
    !Array.isArray(annotations) ||
    annotations.some((a) => !Number.isInteger(a.index) || a.index < 0 || a.index >= values.length)
  )
    throw new RangeError("Annotation indexes must refer to visible observations.");
  const id = `rw-history-${++sequence}`,
    range = maximum - minimum,
    plotHeight = Number.isFinite(height) ? Math.min(320, Math.max(100, height)) : 150;
  const dense = detail === "compact" || (detail === "auto" && values.length > 18);
  const latest = values.at(-1),
    last = latest === null || latest === undefined ? "Missing" : format(latest);
  const grouped = new Map();
  for (const a of annotations) {
    if (!grouped.has(a.index)) grouped.set(a.index, []);
    grouped.get(a.index).push(a);
  }
  const popovers = [...grouped]
    .map(
      ([i, items]) =>
        `<aside id="${id}-note-${i}" class="rw-context" popover="auto" tabindex="0" aria-label="${esc(labels[i])} notes"><strong>${esc(labels[i])} · ${items.length} ${items.length === 1 ? "note" : "notes"}</strong>${items.map((a) => `<p><b>${esc(a.title)}</b><br>${esc(a.description)}</p>`).join("")}</aside>`,
    )
    .join("");
  return `<figure class="rw-history rw-history--range" data-detail="${dense ? "compact" : "full"}" style="--rw-chart-min:${minimum};--rw-chart-max:${maximum};--rw-chart-range:${range};--rw-chart-height:${plotHeight}px" aria-labelledby="${id}-title"><figcaption class="rw-instrument__heading"><div><h3 id="${id}-title">${esc(title)}</h3><span>${esc(unit)} · ${values.length} ${values.length === 1 ? "observation" : "observations"}</span></div><strong class="rw-instrument__readout">${esc(last)}</strong></figcaption>${!values.length ? '<p class="rw-instrument__empty">No observations yet. History is never invented.</p>' : `<div class="rw-history__frame"><div class="rw-history__axis" aria-hidden="true"><span>${esc(axisFormat(maximum))}</span><span>${esc(axisFormat((maximum + minimum) / 2))}</span><span>${esc(axisFormat(minimum))}</span></div><div class="rw-history__plot"><ol class="rw-columns" role="list">${values.map((v, i) => `<li${v === null ? " data-missing" : ""} aria-label="${esc(labels[i])}: ${v === null ? "Missing" : esc(format(v))}"><span class="rw-column-track">${v === null ? "" : `<i class="rw-column-mark" data-value="${v}" style="--rw-amount:${Math.abs(v)}"${v < 0 ? " data-negative" : ""} aria-hidden="true"></i>`}${grouped.has(i) ? `<button type="button" class="rw-history__event" popovertarget="${id}-note-${i}" aria-label="${esc(labels[i])}: ${grouped.get(i).length} recorded notes">${grouped.get(i).length > 1 ? grouped.get(i).length : '<span class="rw-icon" data-icon="sparkle" data-weight="fill" aria-hidden="true"></span>'}</button>` : ""}</span><strong${dense ? " hidden" : ""}>${v === null ? "—" : esc(format(v))}</strong><span class="rw-category"${dense && ![0, Math.floor((values.length - 1) / 2), values.length - 1].includes(i) ? ' style="visibility:hidden"' : ""}>${esc(labels[i])}</span></li>`).join("")}</ol><div class="rw-history__zero" aria-hidden="true"></div></div></div>`}<details class="rw-chart-data rw-disclosure"${tableOpen ? " open" : ""}><summary>Exact observations & notes</summary><table><caption>${esc(title)} · ${esc(unit)} · scale ${esc(axisFormat(minimum))} to ${esc(axisFormat(maximum))}</caption><thead><tr><th scope="col">Observation</th><th scope="col">Value</th><th scope="col">Recorded notes</th></tr></thead><tbody>${values.map((v, i) => `<tr><th scope="row">${esc(labels[i])}</th><td>${v === null ? "Missing" : `<data value="${v}">${esc(exactFormat(v))}</data>`}</td><td>${(grouped.get(i) ?? []).map((a) => `${esc(a.title)}: ${esc(a.description)}`).join("<br>") || "—"}</td></tr>`).join("")}</tbody></table></details>${popovers}</figure>`;
}
