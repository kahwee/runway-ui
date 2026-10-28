/** Synthetic reference data only. No simulation rules or persistence. */
export const defaults = {
  title: "Simulation Observatory",
  subtitle: "A little perspective for your very complicated world.",
  scenario: "steady",
  unit: "units / cycle",
  maximum: 100,
  target: 72,
  plotHeight: 190,
  values: [32, 38, 35, 46, 44, 58, 62, 57, 70, 74, 82, 88],
  labels: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
  forecastCount: 2,
  showAnnotations: true,
  annotationIndex: 5,
  annotationTitle: "The second kettle arrived",
  annotationText:
    "A new workbench came online. Output increased afterward; this chart alone does not establish why.",
  grid: true,
  tableOpen: false,
  resourceCount: 10,
  selectedResource: 0,
  credits: 840,
  upfrontCost: 180,
  recurringCost: 8,
  improvement: 12,
  decisionDisabled: false,
  longLabels: false,
  whimsy: true,
  showScrollCue: true,
};
export const resources = [
  {
    name: "Energy",
    longName: "Energy & improbable machinery",
    stored: 64,
    capacity: 100,
    inflow: 28,
    outflow: 34,
    note: "Consumption is ahead of supply. A spare generator would be reassuring.",
  },
  {
    name: "Materials",
    longName: "Materials of considerable importance",
    stored: 146,
    capacity: 300,
    inflow: 48,
    outflow: 32,
    note: "Stocks are building. There is no prize for filling every cupboard.",
  },
  {
    name: "Water",
    longName: "Water & emergency tea reserves",
    stored: 192,
    capacity: 240,
    inflow: 24,
    outflow: 22,
    note: "A comfortable buffer. The kettle committee approves.",
  },
  {
    name: "Research",
    longName: "Research & promising distractions",
    stored: 73,
    capacity: 100,
    inflow: 12,
    outflow: 4,
    note: "Discoveries are accumulating faster than they are being applied.",
  },
  {
    name: "Provisions",
    longName: "Provisions for unexpected expeditions",
    stored: 84,
    capacity: 120,
    inflow: 18,
    outflow: 16,
    note: "Supplies are steady. Someone has labeled the biscuit tin.",
  },
  {
    name: "Spare parts",
    longName: "Spare parts for unspecified emergencies",
    stored: 31,
    capacity: 80,
    inflow: 8,
    outflow: 11,
    note: "Usage is higher than production. Check the maintenance schedule.",
  },
  {
    name: "Transport",
    longName: "Transport & things with small wheels",
    stored: 56,
    capacity: 100,
    inflow: 14,
    outflow: 12,
    note: "Some spare capacity remains available.",
  },
  {
    name: "Storage",
    longName: "Storage & miscellaneous cupboards",
    stored: 124,
    capacity: 200,
    inflow: 22,
    outflow: 18,
    note: "There is room for the next delivery.",
  },
  {
    name: "Medicine",
    longName: "Medicine & extremely sensible supplies",
    stored: 44,
    capacity: 60,
    inflow: 8,
    outflow: 7,
    note: "A modest reserve with a small replenishment surplus.",
  },
  {
    name: "Equipment",
    longName: "Equipment & suspiciously useful gadgets",
    stored: 92,
    capacity: 160,
    inflow: 16,
    outflow: 12,
    note: "The workbench has space for another good idea.",
  },
  {
    name: "Seed stock",
    longName: "Seed stock for future possibilities",
    stored: 108,
    capacity: 180,
    inflow: 20,
    outflow: 15,
    note: "Enough to begin another growing cycle.",
  },
  {
    name: "Signals",
    longName: "Signals & messages from elsewhere",
    stored: 36,
    capacity: 90,
    inflow: 9,
    outflow: 10,
    note: "The receiver is a little behind. Keep an eye on the queue.",
  },
];
export function makeData(options = {}) {
  const a = { ...defaults, ...options };
  const base = defaults.values;
  const presets = {
    steady: base,
    recovery: [62, 52, 38, 28, 24, 32, 46, 58, 64, 72, 82, 88],
    shortage: [88, 84, 78, 72, 68, 60, 54, 48, 42, 36, 30, 24],
    zero: base.map(() => 0),
    missing: base.map((v, i) => (i === 4 || i === 8 ? null : v)),
  };
  const values = a.scenario === "custom" ? a.values : (presets[a.scenario] ?? base);
  const labels = a.scenario === "custom" ? a.labels : defaults.labels;
  if (!Number.isFinite(a.maximum) || a.maximum <= 0 || a.maximum > 10000)
    throw new Error("Maximum must be a finite number greater than zero and no larger than 10,000.");
  if (!Number.isFinite(a.target) || a.target < 0 || a.target > a.maximum)
    throw new Error("Target must fit the declared 0–maximum scale.");
  if (
    !Array.isArray(values) ||
    values.length < 6 ||
    values.length > 18 ||
    values.some(
      (v) => v !== null && (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > a.maximum),
    )
  )
    throw new Error(
      "Provide 6–18 values between zero and maximum. Use null for missing observations. Values are never silently clipped.",
    );
  if (
    !Array.isArray(labels) ||
    labels.length !== values.length ||
    labels.some((v) => typeof v !== "string" || !v.trim())
  )
    throw new Error("Provide one nonempty string label per observation.");
  if (
    !Number.isInteger(a.forecastCount) ||
    a.forecastCount < 0 ||
    a.forecastCount > Math.min(4, values.length - 2)
  )
    throw new Error("Projected count must be 0–4 and leave at least two observed cycles.");
  for (const key of ["credits", "upfrontCost", "recurringCost", "improvement"])
    if (!Number.isFinite(a[key]) || a[key] < 0)
      throw new Error(`${key} must be a finite nonnegative number.`);
  const count = Math.min(resources.length, Math.max(4, Math.trunc(Number(a.resourceCount) || 10)));
  const selected = Math.min(count - 1, Math.max(0, Math.trunc(Number(a.selectedResource) || 0)));
  const rows = resources
    .slice(0, count)
    .map((r) => ({ ...r, name: a.longLabels ? r.longName : r.name }));
  const lastObserved = values.length - a.forecastCount - 1;
  const metrics = [
    { name: "Output", unit: a.unit, values: values.slice(0, lastObserved + 1), max: a.maximum },
    { name: "Energy reserve", unit: "units", values: [82, 80, 79, 76, 74, 70, 68, 64], max: 100 },
    { name: "Crew on duty", unit: "people", values: [18, 18, 19, 20, 20, 22, 24, 24], max: 32 },
    { name: "Research", unit: "points", values: [38, 42, 43, 49, 54, 58, 66, 73], max: 100 },
    { name: "Readiness", unit: "percent", values: [62, 64, 65, 70, 72, 76, 80, 84], max: 100 },
    { name: "Demand", unit: "orders", values: [34, 39, 36, 44, 48, 50, 56, 60], max: 80 },
  ];
  // Empty-state fixtures are consistently empty; unrelated series remain explicitly illustrative.
  if (a.scenario === "zero") for (const m of metrics) m.values = m.values.map(() => 0);
  return { a, values, labels, rows, selected, lastObserved, metrics };
}
