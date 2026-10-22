import { bindObservatory } from "../../examples/observatory/controller.js";
import { defaults } from "../../examples/observatory/data.js";
import { renderObservatory } from "../../examples/observatory/render.js";
import { flag, object, range, select, text, withDefaults } from "../helpers.js";
import { demoHost } from "../host.js";
export default {
  title: "Compositions/Simulation Observatory",
  tags: ["autodocs"],
  args: defaults,
  globals: { viewport: { value: "observatoryDesk", isRotated: false } },
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: {
        observatoryDesk: {
          name: "Observatory · 1366 × 900",
          styles: { width: "1366px", height: "900px" },
          type: "desktop",
        },
      },
    },
    controls: { expanded: true },
    docs: {
      description: {
        component:
          "A generic desktop reference composition: six CSS small multiples, observed/projected history, target line, native anchored event popover, shared-track resource ledger and an inspectable decision. No simulation rules, chart runtime, canvas or SVG chart. The manager uses a fixed 1366 × 900 desktop viewport so the Controls panel cannot trigger the unsupported-screen notice. Use zoom or open Canvas in a new tab for the full workspace. The toolbar controls theme, density and depth. All fixtures are synthetic. Changes to args remount and reset the local pinned-plan state.",
      },
    },
  },
  argTypes: withDefaults(defaults, {
    title: text("Workspace heading."),
    subtitle: text("One-line introduction."),
    scenario: select(
      ["steady", "recovery", "shortage", "zero", "missing", "custom"],
      "Synthetic data scenario. Presets use an absolute 0–100 dataset; a smaller maximum is rejected when values exceed it.",
      "Data",
    ),
    unit: text("Unit shared by the history caption, summary and exact table."),
    maximum: range(
      1,
      200,
      1,
      "Fixed positive scale. Values outside it produce a readable error.",
      "Data",
    ),
    target: range(0, 200, 1, "Reference threshold, between zero and maximum.", "Data"),
    plotHeight: range(140, 280, 10, "CSS plot block size; no JavaScript geometry."),
    values: {
      ...object(
        "6–18 finite nonnegative values, or null for missing. Do not put numeric strings in the array.",
      ),
      if: { arg: "scenario", eq: "custom" },
    },
    labels: {
      ...object("One nonempty string per equally spaced observation."),
      if: { arg: "scenario", eq: "custom" },
    },
    forecastCount: range(
      0,
      4,
      1,
      "Final N values are explicitly projected; observed metrics never include them.",
      "Data",
    ),
    showAnnotations: flag(
      "Expose a native event popover and the same note in exact data.",
      "Chart",
    ),
    annotationIndex: {
      ...range(0, 17, 1, "Zero-based event location; bounded to the current sequence.", "Chart"),
      if: { arg: "showAnnotations" },
    },
    annotationTitle: {
      ...text("Event heading and accessible trigger label."),
      if: { arg: "showAnnotations" },
    },
    annotationText: {
      ...text("Explanatory note. Associations do not establish causation."),
      if: { arg: "showAnnotations" },
    },
    grid: flag("Show fixed quarter-scale history guide lines.", "Chart"),
    tableOpen: flag("Initially expand exact history values and event note.", "Chart"),
    resourceCount: range(
      4,
      12,
      1,
      "Number of resource rows. More rows exercise the scroll timeline.",
      "Resources",
    ),
    selectedResource: range(
      0,
      11,
      1,
      "Initial inspected row, bounded to the visible row count.",
      "Resources",
    ),
    longLabels: flag("Exercise resource name wrapping and shared row alignment.", "Resources"),
    showScrollCue: flag(
      "Opt into a CSS scroll-timeline progress cue when supported. Native scroll remains available.",
      "Resources",
    ),
    credits: range(
      0,
      2000,
      10,
      "Illustrative available budget; below upfront cost disables review.",
      "Decision",
    ),
    upfrontCost: range(0, 1000, 10, "Illustrative immediate cost in credits.", "Decision"),
    recurringCost: range(0, 100, 1, "Illustrative ongoing credits per cycle.", "Decision"),
    improvement: range(0, 100, 1, "Illustrative supply increase per cycle.", "Decision"),
    decisionDisabled: flag("Explicit unavailable state, independently of budget.", "Decision"),
    whimsy: flag("Show the original CSS compass seal and playful briefing footnote.", "Appearance"),
  }),
};
function render(a) {
  const { root, data } = renderObservatory(a);
  return demoHost(root, () => {
    const controller = bindObservatory(root, data);
    return () => controller.destroy();
  });
}
export const Playground = { render };
export const SupplySqueeze = {
  name: "Supply squeeze",
  args: {
    scenario: "shortage",
    forecastCount: 0,
    annotationTitle: "The workbench took a nap",
    annotationText:
      "A maintenance interruption was recorded. Compare the surrounding observations before deciding what to change.",
    credits: 120,
    resourceCount: 12,
  },
  render,
};
export const MissingReadings = {
  name: "Missing readings",
  args: {
    scenario: "missing",
    tableOpen: true,
    forecastCount: 3,
    annotationIndex: 4,
    annotationTitle: "An instrument lost its notebook",
    annotationText:
      "No reading was recorded for this cycle. The gap is intentionally not interpolated.",
    longLabels: true,
  },
  render,
};
export const BoundaryDesk = {
  name: "Boundary desk",
  args: {
    scenario: "custom",
    values: [0, 100, null, 0, 100, 100, 0, 100, 0, 100, 100, 0],
    labels: [
      "First",
      "Second",
      "Missing",
      "Fourth",
      "Fifth",
      "Sixth",
      "Seventh",
      "Eighth",
      "Ninth",
      "Tenth",
      "Eleventh",
      "Twelfth",
    ],
    forecastCount: 2,
    target: 100,
    resourceCount: 12,
    selectedResource: 11,
    longLabels: true,
    annotationIndex: 11,
    annotationTitle: "A long note at the very edge of the chart",
    tableOpen: true,
  },
  render,
};
