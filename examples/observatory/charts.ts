import { escapeHTML as e } from "./html.ts";
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
  return `<article class="rw-panel rw-trend" data-direction="${delta < 0 ? "down" : "up"}"><div class="rw-trend__label"><span>${e(metric.name)}</span><span class="rw-trend__index" aria-hidden="true">0${index + 1}</span></div><strong class="rw-trend__value">${number(current)} <small class="rw-trend__unit">${e(metric.unit)}</small></strong><small class="rw-trend__change">${icon}${e(change)}</small><div data-trend-chart="${index}"></div></article>`;
}
export function historyMarkup(data, id) {
  const { a, values, labels, lastObserved } = data;
  const eventIndex = Math.min(
    values.length - 1,
    Math.max(0, Math.trunc(Number(a.annotationIndex) || 0)),
  );
  return `<figure class="rw-history" aria-labelledby="${id}-history-title">
  <figcaption class="rw-observatory__panel-heading"><div><span class="rw-kicker">01 / THE BIG PICTURE</span><h2 id="${id}-history-title">Output, with a little context.</h2><p>${values.length} cycles · ${e(a.unit)} · scale 0–${number(a.maximum)}</p></div><span class="rw-badge">${values[lastObserved] === null ? "Missing reading" : `${number(values[lastObserved])} observed`}</span></figcaption>
  <div data-history-chart></div>
  <p class="rw-observatory__note">Observed and projected values are separate series. Projected values are not guaranteed. Target ${number(a.target)} ${e(a.unit)}. Missing readings are gaps.</p>
  ${a.showAnnotations ? `<button class="rw-button" type="button" popovertarget="${id}-event">Cycle ${e(labels[eventIndex])}: ${e(a.annotationTitle)}</button>` : ""}
  <details class="rw-chart-data rw-disclosure"${a.tableOpen ? " open" : ""}><summary>Read the exact observations${a.showAnnotations ? " & event note" : ""}</summary>${a.showAnnotations ? `<p class="rw-observatory__note"><strong>Cycle ${e(labels[eventIndex])}: ${e(a.annotationTitle)}.</strong> ${e(a.annotationText)}</p>` : ""}<table><caption>Output · ${e(a.unit)} · equally spaced cycles</caption><thead><tr><th scope="col">Cycle</th><th scope="col">Value</th><th scope="col">Status</th></tr></thead><tbody>${values.map((v, i) => `<tr><th scope="row">${e(labels[i])}</th><td>${v === null ? "Missing" : number(v)}</td><td>${i > lastObserved ? "Projected" : "Observed"}</td></tr>`).join("")}</tbody></table></details>
  ${a.showAnnotations ? `<aside class="rw-context" id="${id}-event" popover="auto" tabindex="0" aria-label="Chart event"><strong>${e(a.annotationTitle)}</strong><p>Cycle ${e(labels[eventIndex])} · ${e(a.annotationText)}</p></aside>` : ""}</figure>`;
}
