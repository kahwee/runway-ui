import { createInventory } from "../behaviors/inventory.js";
import { bindGamepad, bindNavigation } from "../behaviors/navigation.js";

const $ = (selector) => document.querySelector(selector);
let cycle = 1,
  credits = 600,
  oxygen = 120,
  food = 100,
  power = 80,
  output = 24,
  history = [{ cycle, oxygen }],
  finished = false;
const actions = bindNavigation($("#colony-actions"), { selector: "button", columns: 3 });
function render(message) {
  for (const [id, value] of Object.entries({ oxygen, food, power, output }))
    $(`#${id}`).textContent = value;
  $("#credits").textContent = `${credits} credits`;
  $("#cycle").textContent = `CYCLE ${cycle}`;
  $("#next-cycle").disabled = finished;
  $("#upgrade").disabled = finished || credits < 200;
  actions.refresh();
  $("#history").replaceChildren(
    ...history.slice(-6).map((point) => {
      const tr = document.createElement("tr"),
        th = document.createElement("th"),
        td = document.createElement("td"),
        bar = document.createElement("span"),
        value = document.createElement("td");
      th.scope = "row";
      th.textContent = point.cycle;
      bar.className = "rw-chart__plot";
      bar.style.setProperty("--rw-value", `${Math.min(100, point.oxygen / 3)}%`);
      bar.setAttribute("aria-hidden", "true");
      td.append(bar);
      value.textContent = point.oxygen;
      tr.append(th, td, value);
      return tr;
    }),
  );
  if (message) $("#outcome").textContent = message;
}
$("#next-cycle").addEventListener("click", () => {
  if (finished) return;
  cycle++;
  oxygen = Math.max(0, oxygen + output - 18);
  food = Math.max(0, food + 12 - 15);
  power = Math.max(0, power + 30 - 26);
  credits += 45;
  history.push({ cycle, oxygen });
  finished = !oxygen || !food || !power || cycle >= 20;
  render(
    finished
      ? cycle >= 20 && oxygen && food && power
        ? "Contract complete! The colony is thriving."
        : "Supply failure. Restart and try another plan."
      : `Cycle ${cycle}: stores updated. Food reserves are falling by 3 per cycle.`,
  );
});
$("#upgrade").addEventListener("click", () => {
  if (credits >= 200 && !finished) {
    credits -= 200;
    output += 6;
    render("Oxygen output improved by 6 per cycle.");
  }
});
$("#restart").addEventListener("click", () => {
  cycle = 1;
  credits = 600;
  oxygen = 120;
  food = 100;
  power = 80;
  output = 24;
  history = [{ cycle, oxygen }];
  finished = false;
  render("A fresh colony. Keep everyone supplied for 20 cycles.");
});
const catalog = Array.from({ length: 10000 }, (_, index) => ({
  id: index + 1,
  label: `Supply crate ${index + 1}`,
  icon: ["cube", "package", "flask", "coins"][index % 4],
}));
let inventory = createInventory($("#cargo"), {
  items: catalog,
  columns: 8,
  onSelect: (item) =>
    ($("#selection").textContent = `Selected ${item.label} · manifest ${item.id} of 10,000`),
});
$("#filter").addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase(),
    filtered = catalog.filter((item) => item.label.toLowerCase().includes(query));
  inventory.setItems(filtered);
  $("#selection").textContent =
    `${filtered.length.toLocaleString()} ${filtered.length === 1 ? "manifest matches" : "manifests match"}.`;
});
let controller;
$("#controller").addEventListener("click", () => {
  if (controller) {
    controller.destroy();
    controller = undefined;
    $("#controller").textContent = "Enable controller";
    $("#selection").textContent =
      "Controller polling disabled. Keyboard and pointer input remain available.";
  } else {
    controller = bindGamepad($("#cargo"), inventory);
    $("#controller").textContent = "Disable controller";
    $("#selection").textContent =
      "Controller polling enabled. Focus the grid; use a standard-mapped controller D-pad/stick and primary button.";
  }
});
render();

$("#density").addEventListener("change", (event) => {
  controller?.destroy();
  controller = undefined;
  $("#controller").textContent = "Enable controller";
  inventory.destroy();
  const query = $("#filter").value.trim().toLowerCase();
  inventory = createInventory($("#cargo"), {
    items: catalog.filter((item) => item.label.toLowerCase().includes(query)),
    columns: 8,
    rowHeight: Number(event.target.value),
    onSelect: (item) =>
      ($("#selection").textContent = `Selected ${item.label} · manifest ${item.id} of 10,000`),
  });
  $("#selection").textContent =
    `${event.target.selectedOptions[0].textContent} rows. Selection reset; keyboard navigation remains available.`;
});
