import { escapeHTML } from "./helpers.js";

/** A separate document prevents Storybook's full CSS bundle from masking missing imports. */
export function isolatedFrame({ title, styles, markup }) {
  const frame = document.createElement("iframe");
  frame.title = title;
  frame.style.cssText = "inline-size:100%;block-size:420px;border:0";
  frame.srcdoc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHTML(title)}</title><style>${styles.join("\n").replaceAll("</style", "<\\/style")}</style></head><body style="margin:0;padding:32px"><main class="rw-ui">${markup}</main></body></html>`;
  return frame;
}

/** Called by Storybook's play phase, including after navigating from a fully styled story. */
async function readyFrame(canvasElement, selector) {
  const frame = canvasElement.querySelector("iframe");
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Isolated document did not load")), 5000);
    const ready = () => {
      clearTimeout(timeout);
      resolve();
    };
    if (frame.contentDocument?.querySelector(selector)) ready();
    else frame.addEventListener("load", ready, { once: true });
  });
  return frame;
}

export async function checkIsolatedControls({ canvasElement }) {
  const frame = await readyFrame(canvasElement, ".rw-button");
  const doc = frame.contentDocument;
  const view = frame.contentWindow;
  const style = (selector) => view.getComputedStyle(doc.querySelector(selector));
  if (doc.styleSheets.length !== 1 || doc.querySelector("link"))
    throw new Error("Isolated example must use only its inline entry styles");
  if (!["inline-flex", "flex"].includes(style(".rw-button").display))
    throw new Error("Control CSS missing");
  if (!["inline-grid", "grid"].includes(style(".rw-shortcut").display))
    throw new Error("Shortcut CSS missing");
  if (
    style('[aria-pressed="true"]').backgroundColor ===
    style('[aria-pressed="false"]').backgroundColor
  )
    throw new Error("Pressed button must have a distinct background without patterns CSS");
  if (doc.querySelector(".rw-dock") && style(".rw-dock").display !== "flex")
    throw new Error("Dock CSS missing");
  frame.dataset.verified = "true";
}

export async function checkIsolatedPanels({ canvasElement }) {
  const frame = await readyFrame(canvasElement, ".rw-panel");
  const doc = frame.contentDocument;
  const style = (selector) => frame.contentWindow.getComputedStyle(doc.querySelector(selector));
  if (doc.styleSheets.length !== 1 || doc.querySelector("link"))
    throw new Error("Panel example must use only its declared inline styles");
  if (
    style(".rw-panel").paddingBlockStart !== "22px" ||
    style(".rw-panel").boxSizing !== "border-box"
  )
    throw new Error("Standalone panel recipe missing");
  if (style(".rw-panel__header").display !== "flex") throw new Error("Panel header layout missing");
  if (style('[data-elevation="flat"]').boxShadow !== "none")
    throw new Error("Flat panel must have no shadow");
  if (style("button").display === "inline-flex")
    throw new Error("Unrelated controls leaked into panel example");
  frame.dataset.verified = "true";
}
