import { escapeHTML as e, flag, range, text } from "../helpers.js";

export default {
  title: "Compositions/Desk workspace",
  tags: ["autodocs"],
  globals: { theme: "ledger" },
  args: {
    title: "Field office",
    cash: "84,250",
    staff: 24,
    selected: "People",
    disabled: false,
    quiet: false,
  },
  argTypes: {
    quiet: flag("Use restrained surfaces and controls."),
    title: text("Workspace identity."),
    cash: text("Formatted resource value supplied by the application."),
    staff: range(0, 1000, 1, "Staff count."),
    selected: { control: "select", options: ["Overview", "People", "Projects"] },
    disabled: flag("Disable the example appointment action."),
  },
  parameters: {
    docs: {
      description: {
        component:
          "Command bar, folio navigation, paper sheets, shared-track dossiers and control console. Hosts supply positioning, imagery and business behavior. Navigation here changes the local preview only.",
      },
    },
  },
};
export const Playground = {
  render: (a) => {
    const root = document.createElement("div");
    root.className = "rw-ui";
    if (a.quiet) root.dataset.appearance = "quiet";
    root.style.cssText = "display:grid;gap:20px;max-inline-size:1200px";
    root.innerHTML = `<header class="rw-command-bar"><div class="rw-command-bar__identity"><strong>${e(a.title)}</strong></div><div class="rw-command-bar__metrics"><div class="rw-command-stat"><span>Credits</span><strong>${e(a.cash)}</strong></div><div class="rw-command-stat"><span>Team</span><strong>${a.staff}</strong></div></div></header>
      <div class="story-workspace-grid">
      <nav class="rw-folio-tabs" aria-label="Workspace sections">${["Overview", "People", "Projects"].map((label) => `<button type="button" class="rw-folio-tab"${a.selected === label ? ' aria-current="page"' : ""}>${label}</button>`).join("")}</nav>
      <section class="rw-sheet"><h1>${e(a.selected)}</h1><p>Bring the right people together.</p><div class="rw-dossier-list">${["Operations lead", "Research lead"].map((role) => `<article class="rw-dossier"><div class="rw-dossier__body"><div class="rw-dossier__heading"><span class="rw-kicker">Open position</span><span class="rw-badge">Vacant</span></div><h2>${role}</h2><p>A clear role, useful context, and one next action.</p></div><div class="rw-dossier__actions"><button class="rw-button" type="button" data-variant="primary"${a.disabled ? " disabled" : ""}>Review candidates</button></div></article>`).join("")}</div><p role="status" style="margin-block-start:16px"></p></section></div>
      <footer class="rw-control-console"><strong>Day 12</strong><span>Ready for your next decision.</span><button type="button" class="rw-button" data-variant="primary" data-next>Next day</button></footer>`;
    root.querySelectorAll(".rw-folio-tab").forEach((button) => {
      button.addEventListener("click", () => {
        root.querySelectorAll(".rw-folio-tab").forEach((tab) => {
          tab.removeAttribute("aria-current");
        });
        button.setAttribute("aria-current", "page");
        root.querySelector("h1").textContent = button.textContent;
      });
    });
    root.querySelectorAll(".rw-dossier button").forEach((button) => {
      button.addEventListener("click", () => {
        root.querySelector('[role="status"]').textContent =
          `Reviewing candidates for ${button.closest(".rw-dossier").querySelector("h3").textContent.toLowerCase()}.`;
      });
    });
    let day = 12;
    root.querySelector("[data-next]").addEventListener("click", () => {
      root.querySelector("footer strong").textContent = `Day ${++day}`;
    });
    return root;
  },
};

export const Quiet = { ...Playground, args: { quiet: true } };
