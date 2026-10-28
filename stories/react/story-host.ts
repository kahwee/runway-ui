import { createElement, type ComponentType } from "react";
import { createRoot, type Root } from "react-dom/client";

/** Story-only lifecycle: each connected canvas owns one React root and portal host. */
export function renderReactStory<Props extends object>(
  component: ComponentType<Props>,
  props: Props,
) {
  class ReactStoryHost extends HTMLElement {
    declare root?: Root | null;
    declare component: ComponentType<Props>;
    declare props: Props;
    connectedCallback() {
      if (this.root) return;
      this.classList.add("rw-ui", "react-story-host");
      const surface = this.parentElement?.closest<HTMLElement>("[data-theme]");
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
  }
  if (!customElements.get("runway-react-story"))
    customElements.define("runway-react-story", ReactStoryHost);
  const host = document.createElement("runway-react-story") as ReactStoryHost;
  host.component = component;
  host.props = { ...props };
  return host;
}
