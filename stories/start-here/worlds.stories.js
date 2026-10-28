import "./worlds.css";

export default {
  title: "Start here/Many worlds",
  parameters: {
    docs: {
      description: {
        component:
          "Five themes, one component vocabulary. Each fictional setting uses the same panel, resource, button and progress markup. Theme tokens carry the visual identity; application content supplies the world.",
      },
    },
  },
};
const worlds = [
  {
    theme: "studio",
    category: "Creative workshop",
    title: "Make something lasting.",
    resource: "Materials",
    value: "2,840",
    action: "Open workshop",
    progress: 64,
  },
  {
    theme: "orbital",
    category: "Deep-space logistics",
    title: "The next frontier awaits.",
    resource: "Reserve power",
    value: "86 kWh",
    action: "Plan expedition",
    progress: 86,
  },
  {
    theme: "parchment",
    category: "A living settlement",
    title: "A village takes root.",
    resource: "Winter stores",
    value: "420",
    action: "Visit settlement",
    progress: 42,
  },
  {
    theme: "whimsy",
    category: "A small team, big ideas",
    title: "Good things are growing.",
    resource: "Research points",
    value: "128",
    action: "Explore ideas",
    progress: 72,
  },
  {
    theme: "ledger",
    category: "Field office",
    title: "Every detail matters.",
    resource: "Project budget",
    value: "$84,250",
    action: "Review projects",
    progress: 58,
  },
];
export const Gallery = {
  render: () =>
    `<main class="worlds-gallery"><header><p class="rw-kicker">Runway UI / Many worlds</p><h1>One library. Room for your imagination.</h1><p>Explore five visual directions built from the same HTML components.</p></header><div class="worlds-grid">${worlds.map((world) => `<section class="rw-ui worlds-tile" data-theme="${world.theme}"><p class="rw-kicker">${world.category}</p><article class="rw-panel"><header class="rw-panel__header"><span class="rw-badge">${world.theme}</span><span class="rw-icon" data-icon="compass" aria-hidden="true"></span></header><h2>${world.title}</h2><div class="rw-resource"><div><strong>${world.value}</strong><small>${world.resource}</small></div></div><label class="worlds-progress">Preparation <progress max="100" value="${world.progress}">${world.progress}%</progress></label><a class="rw-button" data-variant="primary" href="./?path=/story/foundations-controls--button&globals=theme:${world.theme}" target="_top">${world.action} <span aria-hidden="true">→</span></a></article></section>`).join("")}</div><p>Fictional scenarios demonstrate styling. Explore components to inspect their markup and states.</p></main>`,
};
