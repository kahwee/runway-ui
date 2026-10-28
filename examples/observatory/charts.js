import { escapeHTML as e } from "./html.js";
// Render inputs, visible numbers and exact tables from the same validated data.
export const number = (v) =>
  v === null ? "—" : new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(v);
export function trendMarkup(metric, index) {
  const current = metric.values.at(-1),
    previous = metric.values.at(-2);
  const comparable = current !== null && previous !== null;
  const delta = comparable ? current - previous : null;
  const direction = delta > 0 ? "arrow-up" : delta < 0 ? "arrow-down" : "arrow-right";
  const change =
    delta === null
      ? "Comparison unavailable"
      : `${number(Math.abs(delta))} ${delta > 0 ? "more" : delta < 0 ? "fewer" : "change"} than previous`;
  const icon =
    delta === null
      ? ""
      : `<span class="rw-icon" data-icon="${direction}" aria-hidden="true"></span> `;
  return `<article class="rw-panel rw-trend" data-direction="${delta < 0 ? "down" : "up"}"><div class="rw-trend__label"><span>${e(metric.name)}</span><span class="rw-trend__index" aria-hidden="true">0${index + 1}</span></div><strong class="rw-trend__value">${number(current)} <small class="rw-trend__unit">${e(metric.unit)}</small></strong><small class="rw-trend__change">${icon}${e(change)}</small><ol class="rw-spark" aria-hidden="true" style="--rw-chart-max:${metric.max}">${metric.values.map((v) => `<li ${v === null ? "data-missing" : `data-value="${v}" style="--rw-amount:${v}"`}></li>`).join("")}</ol></article>`;
}
export function historyMarkup(data, id) {
  const { a, values, labels, lastObserved } = data;
  const eventIndex = Math.min(
    values.length - 1,
    Math.max(0, Math.trunc(Number(a.annotationIndex) || 0)),
  );
  const hasGap = values.includes(null);
  const height = Math.min(280, Math.max(140, Number(a.plotHeight) || 190));
  return `<figure class="rw-history" style="--rw-chart-max:${a.maximum};--rw-chart-height:${height}px;--rw-target:${a.target}" aria-labelledby="${id}-history-title">
  <figcaption class="rw-observatory__panel-heading"><div><span class="rw-kicker">01 / THE BIG PICTURE</span><h2 id="${id}-history-title">Output, with a little context.</h2><p>${values.length} equally spaced cycles · ${e(a.unit)} · fixed scale 0–${number(a.maximum)}</p></div><span class="rw-badge">${values[lastObserved] === null ? "Missing reading" : `${number(values[lastObserved])} observed`}</span></figcaption>
  <div class="rw-history__frame"><div class="rw-history__axis" aria-hidden="true"><span>${number(a.maximum)}</span><span>${number(a.maximum / 2)}</span><span>0</span></div><div class="rw-history__plot"><ol class="rw-columns" role="list" ${a.grid ? "" : 'style="background:none"'}>${values.map((v, i) => `<li${i > lastObserved ? " data-projected" : ""}${v === null ? " data-missing" : ""}><span class="rw-column-track">${v === null ? "" : `<i class="rw-column-mark" data-value="${v}" style="--rw-amount:${v}" aria-hidden="true"></i>`}${a.showAnnotations && i === eventIndex ? `<button class="rw-history__event" type="button" popovertarget="${id}-event" aria-label="Cycle ${e(labels[i])}: ${e(a.annotationTitle)}"><span class="rw-icon" data-icon="sparkle" data-weight="fill" aria-hidden="true"></span></button>` : ""}</span><strong>${number(v)}<span class="rw-sr-only"> ${v === null ? "missing" : i > lastObserved ? "projected" : "observed"}</span></strong><span class="rw-category">${e(labels[i])}</span></li>`).join("")}</ol><div class="rw-history__target" aria-hidden="true"><span>Target ${number(a.target)}</span></div></div></div>
  <div class="rw-history__key"><span><i class="rw-history__swatch" aria-hidden="true"></i>Observed</span>${a.forecastCount ? '<span><i class="rw-history__swatch" data-projected aria-hidden="true"></i>Projected · not guaranteed</span>' : ""}<span><i class="rw-history__swatch" data-target aria-hidden="true"></i>Target ${number(a.target)}</span>${hasGap ? "<span>— Missing observation</span>" : ""}</div>
  <details class="rw-chart-data rw-disclosure"${a.tableOpen ? " open" : ""}><summary>Read the exact observations${a.showAnnotations ? " & event note" : ""}</summary>${a.showAnnotations ? `<p class="rw-observatory__note"><strong>Cycle ${e(labels[eventIndex])}: ${e(a.annotationTitle)}.</strong> ${e(a.annotationText)}</p>` : ""}<table><caption>Output · ${e(a.unit)} · equally spaced cycles</caption><thead><tr><th scope="col">Cycle</th><th scope="col">Value</th><th scope="col">Status</th></tr></thead><tbody>${values.map((v, i) => `<tr><th scope="row">${e(labels[i])}</th><td>${v === null ? "Missing" : number(v)}</td><td>${i > lastObserved ? "Projected" : "Observed"}</td></tr>`).join("")}</tbody></table></details>
  ${a.showAnnotations ? `<aside class="rw-context" id="${id}-event" popover="auto" tabindex="0" aria-label="Chart event"><strong>${e(a.annotationTitle)}</strong><p>Cycle ${e(labels[eventIndex])} · ${e(a.annotationText)}</p></aside>` : ""}</figure>`;
}
