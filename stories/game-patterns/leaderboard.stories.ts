import { escapeHTML as e, flag, object, range, text, withDefaults } from "../helpers.ts";

const hues = ["#c2603f", "#4f7fa8", "#7a8f3a", "#9a6bb0", "#b8851f", "#3a9a8f"];
const args = {
  caption: "Season standings · simulated rivals",
  columns: ["Rank", "Company", "Value", "Outlook"],
  rows: [
    {
      name: "Northwind Works",
      detail: "A neighbouring team",
      value: "$4.2m",
      trend: "up",
      note: "Steady growth",
    },
    {
      name: "Lantern & Co",
      detail: "A neighbouring team",
      value: "$3.8m",
      trend: "up",
      note: "Climbing",
    },
    {
      name: "Your studio",
      detail: "12 people · 4 releases",
      value: "$3.1m",
      trend: "up",
      note: "Building our way",
    },
    {
      name: "Paper Moon",
      detail: "A neighbouring team",
      value: "$2.4m",
      trend: "flat",
      note: "Holding",
    },
    {
      name: "Tinker Labs",
      detail: "A neighbouring team",
      value: "$1.9m",
      trend: "down",
      note: "Cooling",
    },
  ],
  you: 2,
  showTrend: true,
  animateRows: true,
};
export default {
  title: "Game patterns/Leaderboard",
  tags: ["autodocs"],
  args,
  parameters: {
    docs: {
      description: {
        component:
          "A native table of ranked rows: medal ranks for the top three, a who-cell with a tinted avatar, tabular numbers, trend pills and a highlighted row for the viewer (tr[data-you]). Keep th scope attributes, a caption and real text; the medals and arrows are decorative companions to the numbers. Rows rise in with a stagger and wiggle their rank on hover.",
      },
    },
  },
  argTypes: withDefaults(args, {
    caption: text("Table caption, announced by assistive technology."),
    columns: object("Four column headings: rank, name, numeric value and trend."),
    rows: object("Rows: name, detail, value, trend (up, down, flat) and note."),
    you: range(-1, 11, 1, "Index of the viewer's row, or -1 for none.", "State"),
    showTrend: flag("Show the last column.", "Content"),
    animateRows: flag("Stagger rows in on first render.", "Content"),
  }),
};
const initial = (name) => String(name).trim()[0]?.toUpperCase() ?? "?";
export const Playground = {
  render: (a) =>
    !Array.isArray(a.rows) || !a.rows.length || a.rows.length > 12
      ? '<p role="alert">Supply one to twelve rows.</p>'
      : `<section class="rw-panel"><div class="story-scroll" role="region" aria-label="Ranked standings" tabindex="0"><table class="rw-leaderboard"><caption>${e(a.caption)}</caption><thead><tr><th scope="col">${e(a.columns?.[0] ?? "Rank")}</th><th scope="col">${e(a.columns?.[1] ?? "Name")}</th><th scope="col" data-numeric>${e(a.columns?.[2] ?? "Value")}</th>${a.showTrend ? `<th scope="col">${e(a.columns?.[3] ?? "Outlook")}</th>` : ""}</tr></thead><tbody>${a.rows
          .map((r, i) => {
            const trend = ["up", "down", "flat"].includes(r.trend) ? r.trend : "flat";
            return `<tr${i === a.you ? " data-you" : ""}${a.animateRows ? ` style="--rw-row:${i}"` : ' style="animation:none"'}><th scope="row"><span class="rw-rank" data-place="${i + 1}">${i + 1}</span></th><td><div class="rw-leaderboard__who"><span class="rw-avatar" style="--rw-avatar-hue:${hues[i % hues.length]}" aria-hidden="true">${e(initial(r.name))}</span><span><strong>${e(r.name)}${i === a.you ? ' <span class="rw-badge">You</span>' : ""}</strong><small>${e(r.detail ?? "")}</small></span></div></td><td data-numeric>${e(r.value)}</td>${a.showTrend ? `<td><span class="rw-outlook" data-direction="${trend}">${e(r.note ?? "")}</span></td>` : ""}</tr>`;
          })
          .join("")}</tbody></table></div></section>`,
};
export const Stress = {
  name: "Stress cases",
  parameters: { controls: { disable: true } },
  render: () =>
    Playground.render({
      ...args,
      caption: "Twelve rows, long names and large values",
      you: 11,
      rows: Array.from({ length: 12 }, (_, i) => ({
        name:
          i === 4 ? "An Extraordinarily Long Company Name Incorporated Holdings" : `Team ${i + 1}`,
        detail:
          i === 4
            ? "A detail line that is long enough to need wrapping in narrow tables"
            : "Neighbour",
        value: `$${(12_345_678 / (i + 1)).toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
        trend: ["up", "down", "flat"][i % 3],
        note: ["Rising", "Slipping", "Steady"][i % 3],
      })),
    }),
};
