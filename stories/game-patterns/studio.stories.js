import art from "../../examples/assets/studio/season-trophy.webp";
import { escapeHTML as e, exclusive, flag, range, text, withDefaults } from "../helpers.js";

const args = {
  title: "Small beginnings. Great company.",
  league: "Neighborhood",
  season: 3,
  standing: 3,
  illustrated: true,
  pace: 1,
};
export default {
  title: "Game patterns/Paper studio",
  tags: ["autodocs"],
  args,
  argTypes: withDefaults(args, {
    title: text("Season heading."),
    league: text("League name."),
    season: range(1, 99, 1, "Season number."),
    standing: range(1, 12, 1, "Current rank."),
    illustrated: flag("Show host-supplied decorative artwork."),
    pace: range(0, 2, 1, "Selected pace."),
  }),
};
export const Playground = {
  render: (a) =>
    exclusive(
      `<section class="rw-ui rw-native rw-paper-sheet rw-sheet" data-theme="ledger">
  <header class="rw-command-bar rw-paper-command"><div class="rw-command-bar__identity"><small>YOUR STUDIO</small><strong>Northwind Works</strong></div><div class="rw-command-bar__metrics"><div class="rw-command-stat"><span>Cash</span><strong>$250,000</strong><small>116 days runway</small></div><div class="rw-command-stat"><span>Team</span><strong>12</strong></div></div></header>
  <section class="rw-season-cover" style="margin-block:20px"><div class="rw-season-cover__copy"><span class="rw-kicker">SEASON ${e(a.season)}</span><h2>${e(a.title)}</h2><p>Meet the neighboring studios growing alongside you.</p><dl class="rw-season-facts"><div><dt>Your standing</dt><dd>#${e(a.standing)} <span>/ 12</span></dd></div><div><dt>League</dt><dd>${e(a.league)}</dd></div></dl></div>${a.illustrated ? `<img class="rw-season-cover__art" src="${art}" alt="">` : ""}</section>
  <div class="rw-paper-console" style="padding:16px;display:flex;gap:24px;align-items:center"><div class="rw-segmented" data-variant="pace" role="group" aria-label="Work pace"><span class="rw-segmented__label">Pace</span>${["Care", "Steady", "Push"].map((label, i) => `<button class="rw-segment" type="button" aria-pressed="${a.pace === i}"${i === 2 ? ' data-tone="warm"' : ""}>${label}<small>${["Less fatigue", "Balanced", "More output"][i]}</small></button>`).join("")}</div><label>Team focus <select><option>Delivery</option><option>People & wellbeing</option><option>Quality</option></select></label></div></section>`,
      ".rw-segment",
    ),
};
