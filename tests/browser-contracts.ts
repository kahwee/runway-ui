export async function runBehaviorContracts() {
  const modules = await Promise.all([
    import("../behaviors/dialog.ts"),
    import("../behaviors/navigation.ts"),
    import("../behaviors/inventory.ts"),
  ]);
  const [dialogs, navigation, inventory] = modules;
  const assert = (condition, message) => {
    if (!condition) throw Error(message);
  };
  const root = document.createElement("section");
  document.body.append(root);
  root.innerHTML =
    '<nav><button aria-pressed="true">First</button><button>Second</button></nav><div class="inventory" style="height:220px;overflow:auto"></div>';
  const quietFields = document.createElement("section");
  quietFields.className = "rw-ui";
  quietFields.dataset.appearance = "quiet";
  quietFields.innerHTML =
    '<label>Display<select class="rw-input" data-picker="native"><option>Summary</option></select></label>';
  root.append(quietFields);
  const fallbackStyle = getComputedStyle(quietFields.querySelector("select"));
  assert(fallbackStyle.appearance === "none", "Fallback select uses the shared field skin");
  assert(
    fallbackStyle.backgroundImage.includes("linear-gradient"),
    "Quiet fallback keeps both chevron strokes",
  );
  assert(parseFloat(fallbackStyle.paddingInlineEnd) >= 24, "Fallback text reserves arrow space");
  quietFields.remove();
  const nav = navigation.bindNavigation(root.querySelector("nav"));
  const buttons = root.querySelectorAll<HTMLButtonElement>("nav button");
  buttons[0].focus();
  buttons[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  assert(document.activeElement === buttons[1], "Navigation keyboard");
  navigation.bindGamepad(root.querySelector("nav"), nav).destroy();
  nav.destroy();
  assert(!buttons[0].hasAttribute("tabindex"), "Navigation restore");
  let selected;
  const grid = root.querySelector<HTMLElement>(".inventory");
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
  const dialog = document.createElement("dialog");
  dialog.innerHTML = "<button autofocus>Decision</button>";
  document.body.append(dialog);
  let allowed = false;
  const policy = dialogs.bindDialog(dialog, { canDismiss: () => allowed });
  policy.open();
  if (typeof dialog.requestClose === "function") dialog.requestClose();
  else dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
  assert(dialog.open && dialog.getAttribute("closedby") === "none", "Native required decision");
  allowed = true;
  policy.refresh();
  assert(policy.requestClose("done"), "Native optional close request");
  await new Promise(requestAnimationFrame);
  assert(!dialog.open, "Native modal closes");
  policy.destroy();
  dialog.remove();
  root.remove();
  return { modules: modules.length, checks: "passed", browser: navigator.userAgent };
}
