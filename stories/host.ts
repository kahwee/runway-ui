/** Documentation lifecycle only; consumers do not need a custom element. */
if (!customElements.get("runway-demo-host"))
  customElements.define(
    "runway-demo-host",
    class extends HTMLElement {
      declare cleanup?: () => void;
      declare setup?: () => (() => void) | undefined;
      connectedCallback() {
        this.cleanup?.();
        this.cleanup = this.setup?.();
      }
      disconnectedCallback() {
        this.cleanup?.();
        this.cleanup = undefined;
      }
    },
  );
export function demoHost(content, setup) {
  const host = document.createElement("runway-demo-host") as HTMLElement & {
    setup?: () => (() => void) | undefined;
  };
  host.style.display = "block";
  host.append(content);
  host.setup = setup;
  return host;
}
