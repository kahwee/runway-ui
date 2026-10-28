import { escapeHTML } from "./helpers.js";

/** A separate document prevents Storybook's full CSS bundle from masking missing imports. */
export function isolatedFrame({ title, styles, markup }) {
  const frame = document.createElement("iframe");
  frame.title = title;
  frame.style.cssText = "inline-size:100%;block-size:420px;border:0";
  frame.srcdoc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><base href="about:srcdoc"><title>${escapeHTML(title)}</title><style>${styles.join("\n").replaceAll("</style", "<\\/style")}</style></head><body style="margin:0;padding:32px"><main class="rw-ui">${markup}</main></body></html>`;
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

export async function checkIsolatedRecipe({ canvasElement }, key) {
  const selectors = {
    fields: ".rw-input",
    forms: ".rw-fieldset",
    viewNavigation: ".rw-view-tabs",
    sectionNavigation: ".rw-section-tabs",
    charts: ".rw-figure",
  };
  const frame = await readyFrame(canvasElement, selectors[key]);
  const doc = frame.contentDocument;
  const view = frame.contentWindow;
  const element = (selector) => doc.querySelector(selector);
  const style = (selector, pseudo) => view.getComputedStyle(element(selector), pseudo);
  const expect = (condition, message) => {
    if (!condition) throw new Error(`${key}: ${message}`);
  };
  expect(doc.styleSheets.length === 1 && !doc.querySelector("link"), "unexpected external styles");
  if (key === "fields") {
    expect(style(".rw-input").paddingBlockStart === "10px", "field recipe missing");
    expect(
      style('[aria-invalid="true"]').borderTopColor !== style("#workspace-name").borderTopColor,
      "invalid border missing",
    );
    expect(
      element(":disabled").disabled && Number(style(":disabled").opacity) < 1,
      "disabled style missing",
    );
    element("#workspace-name").value = "Updated workspace";
    element("#workspace-name").dispatchEvent(new view.Event("input", { bubbles: true }));
    expect(element("#workspace-name").value === "Updated workspace", "native editing failed");
    element("#region").value = "Highlands";
    expect(element("#region").value === "Highlands", "native selection failed");
  } else if (key === "forms") {
    expect(
      style(".rw-fieldset").display === "grid" && style(".rw-field").display === "grid",
      "form layout missing",
    );
    expect(
      style(".rw-switch").appearance === "none" && style(".rw-range").appearance === "none",
      "switch or range recipe missing",
    );
    expect(
      style('input[type="checkbox"].rw-check', "::before").maskImage !== "none",
      "checkbox icon dependency missing",
    );
    const toggle = element(".rw-switch");
    toggle.click();
    expect(!toggle.checked, "native switch did not toggle");
    toggle.click();
    expect(toggle.checked, "native switch did not restore");
    expect(
      new view.FormData(element("form")).get("team") === "Northwind",
      "native form values missing",
    );
  } else if (key === "viewNavigation" || key === "sectionNavigation") {
    expect(style(selectors[key]).display === "flex", "navigation container missing");
    const link = doc.querySelectorAll("nav a")[1];
    link.focus();
    expect(doc.activeElement === link, "native link focus failed");
    expect(
      view.getComputedStyle(link).borderTopStyle === "solid",
      "navigation item recipe missing",
    );
    if (key === "viewNavigation")
      expect(
        style('[aria-current="page"]').backgroundColor !==
          style("nav a:last-child").backgroundColor,
        "current page styling missing",
      );
    else
      expect(
        ["inline-flex", "flex"].includes(view.getComputedStyle(link).display),
        "control dependency missing",
      );
    link.click();
    expect(view.location.hash === link.getAttribute("href"), "native fragment navigation failed");
  } else if (key === "charts") {
    expect(style(".rw-columns").display === "grid", "column layout missing");
    const marks = [...doc.querySelectorAll(".rw-column-mark")].map(
      (mark) => mark.getBoundingClientRect().height,
    );
    expect(
      Math.abs(marks[0] - 30) < 1 && Math.abs(marks[1] - 90) < 1,
      "numeric amounts do not match the declared scale",
    );
    const axis = element(".rw-chart__axis").getBoundingClientRect().width - 16;
    const bar = element(".rw-chart__plot").getBoundingClientRect().width;
    expect(Math.abs(bar / axis - 0.25) < 0.02, "table bar percentage missing");
    expect(
      element("table caption").textContent.includes("units") &&
        doc.querySelectorAll("tbody th[scope='row']").length === 2,
      "exact-data semantics missing",
    );
  }
  frame.dataset.verified = "true";
}
