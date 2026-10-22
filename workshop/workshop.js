import { bindDialog } from "../behaviors/dialog.js";
import { bindNavigation } from "../behaviors/navigation.js";

const $ = (selector) => document.querySelector(selector);
const dialog = $("#demo-dialog");
const modal = bindDialog(dialog);
$("#theme").addEventListener("change", (event) => {
  document.body.dataset.theme = event.target.value;
  dialog.dataset.theme = event.target.value;
});
function show(title, text) {
  $("#dialog-heading").textContent = title;
  $("#dialog-copy").textContent = text;
  modal.open();
}
$("#inspect").addEventListener("click", () =>
  show(
    "Jules Vega · Systems engineer",
    "Energy 72%. Social battery 38%. Trait: unusually calm in emergencies. Character sheets can use ordinary HTML; the game supplies the data.",
  ),
);
$("#launch").addEventListener("click", () =>
  show(
    "Ready when your product is.",
    "Launch readiness is a sample meter. Your simulation decides when the expedition is ready. This preview does not advance a simulation.",
  ),
);
$("#decision").addEventListener("click", () =>
  show(
    "Give good people good tools.",
    "Estimated cost: $12,000. Expected effect: faster builds. This is a preview; no company money will be spent.",
  ),
);
const descriptions = {
  "Portable terminal": "350 credits · +18% research speed",
  "Control keyboard": "80 credits · +3% focus, +200% noise",
  "Supply station": "220 credits · +8% energy, −1 storage slot",
};
for (const button of document.querySelectorAll("[data-item]"))
  button.addEventListener("click", () => {
    for (const slot of document.querySelectorAll("[data-item]"))
      slot.setAttribute("aria-pressed", String(slot === button));
    const strong = document.createElement("strong");
    strong.textContent = button.dataset.item;
    const p = document.createElement("p");
    p.className = "rw-muted";
    p.textContent = descriptions[button.dataset.item];
    $("#item-info").replaceChildren(strong, p);
  });
for (const button of document.querySelectorAll("[data-section]"))
  button.addEventListener("click", () => {
    for (const item of document.querySelectorAll("[data-section]"))
      item.setAttribute("aria-pressed", String(item === button));
    $("#preview-status").textContent =
      `${button.dataset.section} selected · navigation state preview`;
  });
$("#advance").addEventListener("click", () => {
  const meter = $("#readiness");
  const next = (Number(meter.getAttribute("aria-valuenow")) + 8) % 101;
  meter.setAttribute("aria-valuenow", String(next));
  meter.firstElementChild.style.setProperty("--rw-value", `${next}%`);
  $("#readiness-label").textContent = `${next}%`;
  $("#preview-status").textContent =
    `Sample readiness advanced to ${next}%. No simulation is running.`;
});

bindNavigation(document.querySelector(".rw-dock"), { columns: 3 });
bindNavigation(document.querySelector(".rw-slots"), { columns: 2, wrap: false });
