export async function runBehaviorContracts() {
  const modules = await Promise.all([
    import("../behaviors/dialog.js"),
    import("../behaviors/forms.js"),
    import("../behaviors/navigation.js"),
    import("../behaviors/inventory.js"),
    import("../behaviors/history.js"),
    import("../behaviors/timeseries.js"),
    import("../behaviors/resource.js"),
    import("../behaviors/styles.js"),
    import("../behaviors/actions.js"),
  ]);
  const [dialogs, forms, navigation, inventory, history, timeseries, resource, styles, actions] =
    modules;
  const assert = (condition, message) => {
    if (!condition) throw Error(message);
  };
  const root = document.createElement("section");
  document.body.append(root);
  root.innerHTML =
    '<label for="review-range">Level</label><input class="rw-range" type="range" id="review-range" min="0" max="100" value="25"><output for="review-range"></output><nav><button aria-pressed="true">First</button><button>Second</button></nav><div class="inventory" style="height:220px;overflow:auto"></div><div class="chart"></div>';
  const rangeBinding = forms.bindRanges(root, {
    format: (value, input) => `${input.id}: ${value}`,
  });
  const input = root.querySelector("input");
  input.value = "75";
  input.dispatchEvent(new Event("input", { bubbles: true }));
  assert(root.querySelector("output").value === "review-range: 75", "Range output");
  assert(input.style.getPropertyValue("--rw-fill") === "75%", "Range fill");
  rangeBinding.destroy();
  assert(!input.style.getPropertyValue("--rw-fill"), "Range cleanup");
  const nav = navigation.bindNavigation(root.querySelector("nav"));
  const buttons = root.querySelectorAll("nav button");
  buttons[0].focus();
  buttons[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  assert(document.activeElement === buttons[1], "Navigation keyboard");
  navigation.bindGamepad(root.querySelector("nav"), nav).destroy();
  nav.destroy();
  assert(!buttons[0].hasAttribute("tabindex"), "Navigation restore");
  let selected;
  const grid = root.querySelector(".inventory");
  const slots = inventory.createInventory(grid, {
    items: [
      { label: "Crate", cost: 10 },
      { label: "Tool", cost: 20 },
    ],
    columns: 2,
    onSelect: (item) => {
      selected = item;
    },
  });
  slots.move("right");
  slots.activate();
  assert(selected.cost === 20, "Inventory inferred record callback");
  slots.setItems([{ label: "New", cost: 30 }]);
  slots.activate();
  assert(selected.cost === 30, "Inventory replacement");
  slots.destroy();
  assert(!grid.children.length && !grid.hasAttribute("role"), "Inventory restore");
  assert(
    history
      .renderHistory({
        values: [-1, null, 2],
        labels: ["A", "B", "C"],
        minimum: -5,
        maximum: 5,
        plot: "line",
      })
      .includes("Missing"),
    "History gaps",
  );
  const chart = root.querySelector(".chart");
  const empty = timeseries.mountHistoryWindow(chart, { values: [], labels: [] });
  assert(chart.querySelector("output").textContent === "No observations", "Empty timeline status");
  assert(
    !chart.innerHTML.includes("NaN") && !chart.innerHTML.includes("Infinity"),
    "Empty finite geometry",
  );
  empty.destroy();
  empty.setWindow(0, 7);
  assert(!chart.children.length, "Destroyed timeline stays empty");
  const windowed = timeseries.mountHistoryWindow(chart, {
    values: [1, 2, 3],
    labels: ["A", "B", "C"],
    windowSize: 1,
  });
  chart.querySelector('[data-step="-1"]').click();
  await new Promise(requestAnimationFrame);
  assert(windowed.state.start === 1, "Native timeline pager");
  windowed.setWindow(0, 2);
  assert(windowed.state.end === 2, "Programmatic timeline");
  windowed.destroy();
  const dialog = document.createElement("dialog");
  dialog.innerHTML = "<button autofocus>Decision</button>";
  document.body.append(dialog);
  let allowed = false;
  const policy = dialogs.bindDialog(dialog, { canDismiss: () => allowed });
  policy.open();
  dialog.requestClose();
  assert(dialog.open && dialog.closedBy === "none", "Native required decision");
  allowed = true;
  policy.refresh();
  assert(policy.requestClose("done"), "Native optional close request");
  await new Promise(requestAnimationFrame);
  assert(!dialog.open, "Native modal closes");
  policy.destroy();
  dialog.remove();
  let attempts = 0;
  const cached = resource.createLazyResource(() => {
    attempts++;
    return false;
  });
  await cached.load();
  await cached.load();
  assert(attempts === 1, "Falsy cache");
  let runs = 0;
  const action = actions.createLazyActionRouter({
    features: { sample: { names: ["run"], load: () => ({ run: () => runs++ }) } },
  });
  const control = document.createElement("button");
  control.dataset.action = "run";
  root.append(control);
  await action(control, new Event("click"));
  assert(runs === 1 && !control.disabled, "Lazy action");
  const sheet = document.createElement("link");
  sheet.rel = "stylesheet";
  document.head.append(sheet);
  await styles.loadStylesheet(sheet, "/examples/lazy-workspace/panel.css");
  sheet.remove();
  root.remove();
  return { modules: modules.length, checks: "passed", browser: navigator.userAgent };
}
