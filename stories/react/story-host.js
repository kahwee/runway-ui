import { createElement } from "react";
import { createRoot } from "react-dom/client";

/** Story-only lifecycle: each connected canvas owns one React root and portal host. */
export function renderReactStory(component, props) {
  if (!customElements.get("runway-react-story")) {
    customElements.define(
      "runway-react-story",
      class extends HTMLElement {
        connectedCallback() {
          if (this.root) return;
          this.classList.add("rw-ui", "react-story-host");
          const surface = this.parentElement?.closest("[data-theme]");
          for (const key of ["theme", "density", "depth", "skin"])
            if (surface?.dataset[key]) this.dataset[key] = surface.dataset[key];
          const content = document.createElement("div");
          const portal = document.createElement("div");
          this.replaceChildren(content, portal);
          this.root = createRoot(content);
          this.root.render(createElement(this.component, { ...this.props, portal }));
        }
        disconnectedCallback() {
          this.root?.unmount();
          this.root = null;
        }
      },
    );
  }
  const host = document.createElement("runway-react-story");
  host.component = component;
  host.props = { ...props };
  return host;
}
