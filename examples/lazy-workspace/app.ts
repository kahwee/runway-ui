import { createLazyActionRouter } from "../../behaviors/actions.ts";
import { createLazyResource, resourceUrl } from "../../behaviors/resource.ts";
import { loadStylesheet } from "../../behaviors/styles.ts";

const panel = document.querySelector("#panel");
const status = document.querySelector("#status");
// These facts and outcomes belong to this example, never to Runway.
let supplies = 0;
const feature = createLazyResource(async (attempt) => {
  const [module] = await Promise.all([
    import(resourceUrl(new URL("panel.ts", import.meta.url), attempt)),
    loadStylesheet(document.querySelector("#panel-style")),
  ]);
  return module;
});
const route = createLazyActionRouter({
  features: {
    supplies: {
      names: ["order"],
      load: async () => {
        await feature.load();
        return {
          order: () => {
            supplies++;
            status.textContent = `${supplies} ${supplies === 1 ? "crate" : "crates"} received`;
          },
        };
      },
    },
  },
  onError: () => {
    status.textContent = "Could not load controls. Try again.";
  },
});
async function open() {
  panel.setAttribute("aria-busy", "true");
  status.textContent = "Loading supply panel…";
  try {
    const module = await feature.load();
    panel.innerHTML = module.render();
    status.textContent = "Supply panel ready";
  } catch {
    status.textContent = "Panel unavailable. Open it again to retry.";
  } finally {
    panel.removeAttribute("aria-busy");
  }
}
function action(event) {
  const button = event.target.closest("button[data-action]");
  if (button && panel.contains(button)) route(button, event);
}
const button = document.querySelector("#open");
button.addEventListener("click", open);
panel.addEventListener("click", action);
// Embedded hosts should remove their own listeners when unmounting.
export function destroy() {
  button.removeEventListener("click", open);
  panel.removeEventListener("click", action);
}
