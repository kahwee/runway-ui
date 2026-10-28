import { bindDialog, type DialogController } from "@kahwee/runway-ui/dialog";
import { createInventory, type InventoryItem } from "@kahwee/runway-ui/inventory";
import {
  bindGamepad,
  bindNavigation,
  type Direction,
  type Navigation,
} from "@kahwee/runway-ui/navigation";

const root = document.createElement("section");
const modal: DialogController = bindDialog(document.createElement("dialog"), {
  canDismiss: () => false,
});
const issued: boolean = modal.requestClose("accepted");
void issued;
modal.refresh();
modal.destroy();
// @ts-expect-error Native dialog required, not any HTMLElement.
bindDialog(root);

const navigation: Navigation = bindNavigation(root, { columns: () => 3 });
const direction: Direction = "right";
navigation.move(direction);
const focused: HTMLElement[] = navigation.refresh();
void focused;
bindGamepad(root, navigation).destroy();
// @ts-expect-error Invalid direction.
navigation.move("diagonal");
// @ts-expect-error Column callback must return a number.
bindNavigation(root, { columns: () => "3" });

const item: InventoryItem & { cost: number } = { label: "Crate", cost: 15 };
const inventory = createInventory(root, {
  items: [item],
  onSelect(selected, index) {
    selected.cost.toFixed();
    index.toFixed();
    // @ts-expect-error Preserve the inferred item shape.
    selected.unknown;
  },
});
inventory.setItems([{ label: "Box", cost: 25 }]);
// @ts-expect-error Replacement items retain the original shape.
inventory.setItems([{ label: "Box" }]);
inventory.move("pageup");
inventory.destroy();
