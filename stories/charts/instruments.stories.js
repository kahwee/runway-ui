import { renderHistory } from "../../behaviors/history.js";
import { mountHistoryWindow } from "../../behaviors/timeseries.js";
import { escapeHTML as e, flag, object, range, select, text, withDefaults } from "../helpers.js";

const args = {
  title: "Supply balance",
  unit: "units / cycle",
  preset: "signed",
  count: 1000,
  windowSize: 30,
  minimum: -100,
  maximum: 100,
  height: 180,
  detail: "auto",
  plot: "columns",
  annotations: true,
  eventTitle: "The second workbench opened",
  eventText: "A decision was recorded here. Later readings include other activity too.",
  tableOpen: false,
  showImpact: true,
  negativeTone: "neutral",
  values: [12, 24, null, -18, 30, 42],
  labels: ["01", "02", "03", "04", "05", "06"],
};
export default {
  title: "Charts/History instruments",
  tags: ["autodocs"],
  args,
  parameters: {
    docs: {
      description: {
        component:
          "A generic signed CSS history instrument. Supports 1–366 observations, explicit gaps, native anchored notes and exact data. Values and units come from the host; no simulation or financial rules are embedded. The global Play material adds tactile surfaces to existing panels.",
      },
    },
  },
  argTypes: withDefaults(args, {
    title: text("Instrument title."),
    unit: text("Visible measurement unit."),
    preset: select(
      ["signed", "zero", "missing", "custom"],
      "Signed, zero and missing fixtures retain the declared scale.",
      "Data",
    ),
    count: range(
      1,
      5000,
      1,
      "Synthetic observations (one per day). Above 90 the series is windowed: only the selected window is drawn, and nothing is dropped.",
      "Data",
    ),
    windowSize: select([7, 14, 30, 90], "Days drawn at once when the series is windowed.", "Data"),
    minimum: range(-200, 0, 10, "Lower bound, must include zero.", "Data"),
    maximum: range(
      0,
      200,
      10,
      "Upper bound; range must be positive. Out-of-scale input is rejected.",
      "Data",
    ),
    height: range(100, 320, 10, "CSS plot height."),
    plot: select(
      ["columns", "line"],
      "Straight observed segments; missing values break the line.",
      "Chart",
    ),
    detail: select(
      ["auto", "compact", "full"],
      "Auto suppresses dense numeric labels after 18 points. Exact table stays available.",
      "Chart",
    ),
    annotations: flag("Show a native event note on a real observation.", "Chart"),
    eventTitle: { ...text("Marker note title."), if: { arg: "annotations" } },
    eventText: { ...text("Marker description; plain text, escaped."), if: { arg: "annotations" } },
    tableOpen: flag("Start with exact observations expanded.", "Chart"),
    showImpact: flag("Show a native comparison table using shared impact subgrids.", "Chart"),
    negativeTone: select(
      ["neutral", "warning", "favorable"],
      "Application-defined meaning of negative values.",
      "Appearance",
    ),
    values: {
      ...object("Finite in-scale signed values; null means missing."),
      if: { arg: "preset", eq: "custom" },
    },
    labels: { ...object("One label per value."), if: { arg: "preset", eq: "custom" } },
  }),
};
export const Playground = {
  render: (a) => {
    const count = Math.min(5000, Math.max(1, Math.round(Number(a.count) || 30)));
    const day = (i) =>
      new Date(Date.UTC(2023, 0, 1 + i)).toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        year: count > 365 ? "2-digit" : undefined,
        timeZone: "UTC",
      });
    const values =
      a.preset === "custom"
        ? a.values
        : Array.from({ length: count }, (_, i) =>
            a.preset === "zero"
              ? 0
              : a.preset === "missing" && i % 7 === 4
                ? null
                : Math.round(
                    Math.max(-100, Math.min(100, Math.sin(i * 0.37) * 55 + Math.sin(i / 58) * 35)),
                  ),
          );
    const labels =
      a.preset === "custom" ? a.labels : Array.from({ length: count }, (_, i) => day(i));
    if (!Array.isArray(values) || !Array.isArray(labels))
      return '<p role="alert">Supply arrays for observations and labels.</p>';
    const annotations =
      a.annotations && values.length
        ? [
            {
              index: Math.floor((values.length - 1) / 2),
              title: a.eventTitle,
              description: a.eventText,
            },
          ]
        : [];
    const before = values.at(-2),
      after = values.at(-1),
      comparable = Number.isFinite(before) && Number.isFinite(after);
    const impact = a.showImpact
      ? `<section class="rw-panel"><table class="rw-impact"><caption>Latest observation comparison · ${e(a.unit)}</caption><thead><tr class="rw-impact__row" data-heading><th scope="col">Signal</th><th scope="col">Before</th><th scope="col">After</th><th scope="col">Change</th></tr></thead><tbody><tr class="rw-impact__row"><th scope="row">${e(a.title)}</th><td>${before === null || before === undefined ? "Missing" : e(before)}</td><td>${after === null || after === undefined ? "Missing" : e(after)}</td><td>${comparable ? `${after - before > 0 ? "+" : ""}${e(after - before)}` : "Unavailable"}</td></tr></tbody></table></section>`
      : "";
    const long = values.length > 90;
    try {
      const html = `<section class="rw-console" style="max-inline-size:1050px"><article class="rw-instrument" style="--rw-negative-color:var(${a.negativeTone === "warning" ? "--rw-danger" : a.negativeTone === "favorable" ? "--rw-accent" : "--rw-muted"})">${long ? "<div data-timeline></div>" : renderHistory({ ...a, values, labels, annotations })}<p class="rw-instrument__note">A zero-centered scale. Negative does not automatically mean bad; the application supplies the meaning.</p></article>${impact}</section>`;
      const wrap = document.createElement("div");
      wrap.innerHTML = html;
      if (long) {
        const { title, unit, minimum, maximum, height, tableOpen } = a;
        mountHistoryWindow(wrap.querySelector("[data-timeline]"), {
          title,
          unit,
          minimum,
          maximum,
          height,
          detail: "compact",
          plot: a.plot,
          tableOpen,
          values,
          labels,
          annotations,
          windowSize: Number(a.windowSize) || 30,
          windowSizes: [7, 14, 30, 90],
        });
      }
      return wrap;
    } catch (error) {
      return `<p role="alert">${String(error.message).replaceAll("<", "&lt;")}</p>`;
    }
  },
};

export const LineHistory = {
  ...Playground,
  args: { count: 30, plot: "line", preset: "missing", showImpact: false },
};
