import { bounded, escapeHTML as e, flag, meta, object, range, select, text } from "../helpers.js";

const args = {
  kind: "columns",
  title: "Monthly output",
  unit: "units",
  preset: "sample",
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  values: [24, 38, 32, 61, 54, 82],
  secondaryValues: [18, 22, 36, 24, 18, 10],
  maximum: 100,
  height: 180,
  grid: true,
  tableOpen: false,
  seriesLabel: "Scheduled",
  secondaryLabel: "Available",
  customColor: false,
  color: "#355c4b",
  width: 850,
};
export default {
  title: "Charts/CSS plots",
  tags: ["autodocs"],
  ...meta(
    "Charts/CSS plots",
    "One chart playground, explicit data and shared scales. Controls update HTML values and CSS inputs together. CSS draws every mark; no SVG, canvas or chart dependency. Invalid input produces a readable message instead of a misleading plot. Six-point areas require evenly spaced observations. Diverging bars use a symmetric zero axis.",
    args,
    {
      kind: select(
        ["columns", "stacked", "diverging", "area", "horizontal"],
        "Plot primitive; no synthetic game logic.",
        "Chart",
      ),
      title: text("Caption describing the measurement."),
      unit: text("Unit displayed with the scale."),
      preset: select(
        ["sample", "zero", "boundary", "custom"],
        "Sample, empty and full-scale data share the same declared maximum. Custom enables array editors.",
        "Data",
      ),
      labels: {
        ...object("One category label per observation."),
        if: { arg: "preset", eq: "custom" },
      },
      values: {
        ...object(
          "Finite numeric observations. Signed values are accepted only by diverging bars.",
        ),
        if: { arg: "preset", eq: "custom" },
      },
      secondaryValues: {
        ...object("Nonnegative second-series amounts; segment totals cannot exceed maximum."),
        if: { arg: "kind", eq: "stacked" },
      },
      maximum: range(
        1,
        500,
        1,
        "Positive shared maximum; changing it does not silently normalize custom data.",
        "Data",
      ),
      height: range(100, 320, 20, "Plot block size in CSS pixels."),
      width: range(320, 1100, 20, "Maximum figure width; try narrow panel container queries."),
      grid: flag("Background grid for columns and area.", "Appearance"),
      tableOpen: flag("Initial open state of the native exact-data disclosure.", "Content"),
      seriesLabel: {
        ...text("First legend and table column label."),
        if: { arg: "kind", eq: "stacked" },
      },
      secondaryLabel: {
        ...text("Second legend and table column label."),
        if: { arg: "kind", eq: "stacked" },
      },
      customColor: flag("Override the theme accent for this figure only.", "Appearance"),
      color: {
        control: "color",
        description: "--rw-chart-color override; otherwise follows the toolbar theme.",
        if: { arg: "customColor" },
        table: { category: "Appearance", type: { summary: "CSS color" } },
      },
    },
  ),
};

export const Columns = {
  name: "Playground",
  render: (a) => {
    const max = bounded(a.maximum, 1, 500, 100),
      height = bounded(a.height, 100, 320, 180);
    const sample = [24, 38, 32, 61, 54, 82];
    const values =
      a.preset === "custom"
        ? a.values
        : sample.map((v, i) =>
            a.preset === "zero"
              ? 0
              : a.preset === "boundary"
                ? a.kind === "diverging" && i % 2
                  ? -max
                  : max
                : a.kind === "diverging" && i % 2
                  ? -v
                  : v,
          );
    const labels = a.preset === "custom" ? a.labels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const secondary =
      a.preset === "zero"
        ? Array(6).fill(0)
        : a.preset === "boundary"
          ? Array(6).fill(0)
          : a.secondaryValues;
    const figure = document.createElement("figure");
    figure.className = "rw-figure";
    figure.style.setProperty("--rw-chart-max", max);
    figure.style.setProperty("--rw-chart-height", `${height}px`);
    figure.style.maxInlineSize = `${bounded(a.width, 320, 1100, 850)}px`;
    figure.dataset.grid = a.grid ? "on" : "off";
    if (a.customColor && CSS.supports("color", a.color))
      figure.style.setProperty("--rw-chart-color", a.color);
    const invalid = (message) => {
      figure.innerHTML = `<figcaption>${e(a.title)}</figcaption><p role="alert">${e(message)}</p>`;
      return figure;
    };
    if (
      !Array.isArray(values) ||
      !values.length ||
      values.length > 24 ||
      values.some((v) => typeof v !== "number" || !Number.isFinite(v))
    )
      return invalid("Provide 1–24 finite numeric values.");
    if (!Array.isArray(labels) || labels.length !== values.length)
      return invalid("Provide one category label for each value.");
    if (values.some((v) => Math.abs(v) > max || (a.kind !== "diverging" && v < 0)))
      return invalid(
        "Values must fit the declared scale. Only diverging bars support negative values.",
      );
    if (a.kind === "area" && values.length !== 6)
      return invalid("The area primitive requires exactly six equally spaced observations.");
    if (
      a.kind === "stacked" &&
      (!Array.isArray(secondary) ||
        secondary.length !== values.length ||
        secondary.some((v, i) => !Number.isFinite(v) || v < 0 || v + values[i] > max))
    )
      return invalid(
        "Second-series values must be nonnegative numbers with matching length. Each stack total must fit the maximum.",
      );
    const scale = a.kind === "diverging" ? `−${max} to +${max}` : `0–${max}`;
    let markup = `<figcaption>${e(a.title)}<small>${e(a.unit)} · ${scale}</small></figcaption>`;
    const mark = (className, v, extra = "") =>
      `<i class="${className}" data-value="${v}" style="--rw-amount:${v}"${extra}></i>`;
    if (a.kind === "columns")
      markup += `<ol class="rw-columns" role="list">${values.map((v, i) => `<li><span class="rw-column-track" aria-hidden="true">${mark("rw-column-mark", v)}</span><strong>${v}</strong><span class="rw-category">${e(labels[i])}</span></li>`).join("")}</ol>`;
    if (a.kind === "stacked")
      markup += `<ul class="rw-series-list" role="list">${values.map((v, i) => `<li><span>${e(labels[i])}</span><span class="rw-stack-track" aria-hidden="true">${mark("rw-stack-mark", v)}${mark("rw-stack-mark", secondary[i], ' data-series="secondary"')}</span><strong>${v + secondary[i]}</strong></li>`).join("")}</ul><div class="rw-legend"><span><i></i>${e(a.seriesLabel)}</span><span data-series="secondary"><i></i>${e(a.secondaryLabel)}</span></div>`;
    if (a.kind === "diverging")
      markup += `<ul class="rw-series-list" role="list">${values.map((v, i) => `<li><span>${e(labels[i])}</span><span class="rw-diverging-track" aria-hidden="true">${mark("rw-diverging-mark", v, v < 0 ? " data-negative" : "")}</span><strong>${v > 0 ? "+" : ""}${v}</strong></li>`).join("")}</ul><div class="rw-chart-scale"><span>−${max}</span><span>0</span><span>+${max}</span></div>`;
    if (a.kind === "area")
      markup += `<div class="rw-area" aria-hidden="true" style="${values.map((v, i) => `--rw-y${i}:${100 - (v / max) * 100}%`).join(";")}"></div><div class="rw-chart-scale"><span>${e(labels[0])}</span><span>${e(labels.at(-1))}</span></div>`;
    if (a.kind === "horizontal")
      markup += `<table class="rw-chart"><caption>${e(a.title)} · ${scale} ${e(a.unit)}</caption><thead><tr><th scope="col">Category</th><th scope="col" class="rw-chart__axis">Plot</th><th scope="col">${e(a.unit)}</th></tr></thead><tbody>${values.map((v, i) => `<tr><th scope="row">${e(labels[i])}</th><td><span class="rw-chart__plot" style="--rw-value:${(v / max) * 100}%" aria-hidden="true"></span></td><td>${v}</td></tr>`).join("")}</tbody></table>`;
    markup += `<details class="rw-chart-data"${a.tableOpen ? " open" : ""}><summary>View exact data</summary><table><caption>${e(a.title)} · ${e(a.unit)}</caption><thead><tr><th scope="col">Category</th><th scope="col">${e(a.kind === "stacked" ? a.seriesLabel : a.unit)}</th>${a.kind === "stacked" ? `<th scope="col">${e(a.secondaryLabel)}</th>` : ""}</tr></thead><tbody>${values.map((v, i) => `<tr><th scope="row">${e(labels[i])}</th><td>${v}</td>${a.kind === "stacked" ? `<td>${secondary[i]}</td>` : ""}</tr>`).join("")}</tbody></table></details>`;
    figure.innerHTML = markup;
    return figure;
  },
};
