import { escapeHTML as e, select, text } from "../helpers.ts";
import "./recipes.css";

const recipes = ["Mission card", "Resource HUD", "Native dialog"] as const;
type Recipe = (typeof recipes)[number];
let sequence = 0;

const notes: Record<Recipe, { purpose: string; contract: string; guide: string }> = {
  "Mission card": {
    purpose: "Give one clear decision a small, welcoming home.",
    contract:
      "A real heading, a labelled progress value, and one primary action. Your application owns what the action does.",
    guide: "COMPONENTS.html",
  },
  "Resource HUD": {
    purpose: "Make a useful number understandable at a glance.",
    contract:
      "Keep the resource name beside its value. Format values in the host; color and icons never replace the label.",
    guide: "COMPONENTS.html",
  },
  "Native dialog": {
    purpose: "Ask for a decision without reinventing focus or keyboard behavior.",
    contract:
      "The browser owns focus, inertness and Escape. Native invoker commands open this example; older browsers can use the optional bindDialog helper.",
    guide: "DIALOG.html",
  },
};

export default {
  title: "Start here/Recipe book",
  tags: ["autodocs"],
  args: {
    recipe: "Mission card",
    heading: "Prepare the expedition",
    actionLabel: "Plan expedition",
  },
  argTypes: {
    recipe: select(recipes, "Choose a complete, copyable HTML recipe."),
    heading: text("A real heading shared by the preview and its source."),
    actionLabel: text("A descriptive primary action. Preview actions stay local."),
  },
  parameters: {
    docs: {
      description: {
        component:
          "Start small: each recipe uses the real Runway stylesheet, shows the exact HTML it renders, explains the interaction contract, and links to the matching guide. Use the toolbar to explore themes. The vanilla CSS has no runtime dependencies; optional behavior belongs to your application.",
      },
    },
  },
};

export const Playground = {
  render: (
    args: { recipe: Recipe; heading: string; actionLabel: string },
    context: { globals: Record<string, string> },
  ) => {
    const recipe = recipes.includes(args.recipe) ? args.recipe : "Mission card";
    const note = notes[recipe];
    const id = `recipe-${++sequence}`;
    const theme = context.globals.theme || "studio";
    const heading = e(args.heading);
    const action = e(args.actionLabel);
    const markup =
      recipe === "Resource HUD"
        ? `<section class="rw-ui rw-panel" data-theme="${e(theme)}" aria-labelledby="${id}">
  <h2 id="${id}" class="rw-panel__title">${heading}</h2>
  <div class="rw-resource">
    <span class="rw-resource__icon" aria-hidden="true">◈</span>
    <div><strong>2,840</strong><small>Supplies available</small></div>
  </div>
  <p>Enough for the next expedition. Values are fictional.</p>
</section>`
        : recipe === "Native dialog"
          ? `<div class="rw-ui" data-theme="${e(theme)}">
  <button type="button" class="rw-button" data-variant="primary"
    command="show-modal" commandfor="${id}">Open expedition brief</button>
  <dialog id="${id}" class="rw-dialog" aria-labelledby="${id}-title">
    <h2 id="${id}-title">${heading}</h2>
    <p>Your supplies are ready. Nothing is submitted by this preview.</p>
    <form method="dialog" class="rw-dialog__actions">
      <button class="rw-button" data-variant="secondary" value="cancel" autofocus>Not yet</button>
      <button class="rw-button" data-variant="primary" value="confirm">${action}</button>
    </form>
  </dialog>
</div>`
          : `<section class="rw-ui rw-panel" data-theme="${e(theme)}" aria-labelledby="${id}">
  <p class="rw-kicker">Your next adventure</p>
  <h2 id="${id}" class="rw-panel__title">${heading}</h2>
  <p>Bring a little order to a world full of possibilities.</p>
  <label>Supplies packed <progress max="100" value="64">64%</progress></label>
  <button type="button" class="rw-button" data-variant="primary">${action}</button>
</section>`;
    const source = `<link rel="stylesheet" href="./runway-ui/dist/runway-ui.css">\n\n${markup}`;
    const root = document.createElement("main");
    root.className = "recipe-book";
    root.innerHTML = `
      <header class="recipe-book__header"><p class="rw-kicker">Your first building block</p><h1>A recipe for a little possibility.</h1><p class="rw-muted">Choose a recipe in Controls. Change its words. Try a theme. Then take the HTML with you.</p></header>
      <div class="recipe-book__grid">
        <section class="recipe-book__preview" aria-labelledby="recipe-preview-title"><div class="recipe-book__caption"><h2 id="recipe-preview-title">${e(recipe)}</h2><span class="rw-badge">Live preview</span></div><p class="rw-muted">${e(note.purpose)}</p><div class="recipe-book__sample">${markup}</div><p class="recipe-book__result" role="status" aria-live="polite">Fictional values. Actions stay in this preview.</p></section>
        <section class="recipe-book__source" aria-labelledby="recipe-source-title"><div class="recipe-book__caption"><h2 id="recipe-source-title">Make it yours</h2><button class="rw-button" type="button" data-variant="secondary" data-copy-recipe>Copy HTML</button></div><pre tabindex="0" aria-label="Copyable recipe HTML"><code>${e(source)}</code></pre><p class="recipe-book__copy-status" role="status" aria-live="polite"></p></section>
      </div>
      <aside class="rw-panel recipe-book__contract" aria-labelledby="recipe-contract-title"><p class="rw-kicker">The details that matter</p><h2 id="recipe-contract-title">A small contract, clearly stated.</h2><p>${e(note.contract)}</p><nav aria-label="Continue learning"><a href="../docs/${note.guide}" target="_top">Read the component guide →</a><a href="../docs/DEPENDENCIES.html" target="_top">Find the minimal CSS imports →</a></nav></aside>
      <p class="recipe-book__install">Install from GitHub: <code>bun add github:kahwee/runway-ui</code>. This project is not published to npm.</p>`;
    root
      .querySelector<HTMLButtonElement>("[data-copy-recipe]")
      .addEventListener("click", async () => {
        const status = root.querySelector(".recipe-book__copy-status");
        try {
          await navigator.clipboard.writeText(source);
          status.textContent = "HTML copied. Add the stylesheet from your local Runway UI copy.";
        } catch {
          status.textContent = "Clipboard unavailable. Select the HTML above and copy it manually.";
          root.querySelector<HTMLElement>("pre").focus();
        }
      });
    const sample = root.querySelector(".recipe-book__sample");
    if (recipe === "Mission card") {
      sample.querySelector("button").addEventListener("click", () => {
        root.querySelector(".recipe-book__result").textContent =
          "Expedition planned in this preview. Your world is still yours to build.";
      });
    }
    if (recipe === "Native dialog") {
      const button = sample.querySelector("button");
      const dialog = sample.querySelector("dialog");
      // Preserve the native dialog contract on browsers without invoker commands.
      if (!("commandForElement" in HTMLButtonElement.prototype))
        button.addEventListener("click", () => dialog.showModal());
      dialog.addEventListener("cancel", () => {
        dialog.returnValue = "cancel";
      });
      dialog.addEventListener("close", () => {
        root.querySelector(".recipe-book__result").textContent =
          dialog.returnValue === "confirm"
            ? "Plan confirmed in this preview."
            : "Decision cancelled. Nothing was submitted.";
      });
    }
    return root;
  },
};
