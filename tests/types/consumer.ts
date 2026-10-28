import { type ActionGroup, createActionRouter, createLazyActionRouter } from "runway-ui/actions";
import { bindDialog, type DialogController } from "runway-ui/dialog";
import { bindRanges, type RangeBindingOptions } from "runway-ui/forms";
import { type HistoryAnnotation, type HistoryOptions, renderHistory } from "runway-ui/history";
import { createInventory, type InventoryItem } from "runway-ui/inventory";
import { bindGamepad, bindNavigation, type Direction, type Navigation } from "runway-ui/navigation";
import { createLazyResource, type LazyResource, resourceUrl } from "runway-ui/resource";
import { loadStylesheet } from "runway-ui/styles";
import {
  type HistoryWindow,
  type HistoryWindowOptions,
  mountHistoryWindow,
} from "runway-ui/timeseries";

const root = document.createElement("section");
const button = document.createElement("button");
const event = new MouseEvent("click");
const modal: DialogController = bindDialog(document.createElement("dialog"), {
  canDismiss: () => false,
});
const issued: boolean = modal.requestClose("accepted");
void issued;
modal.refresh();
modal.destroy();
// @ts-expect-error Native dialog required, not any HTMLElement.
bindDialog(root);

const ranges: RangeBindingOptions = {
  format: (value, input) => `${input.name}: ${value.toFixed(1)}`,
};
bindRanges(document, ranges).destroy();
// @ts-expect-error Formatters receive numeric values.
bindRanges(root, { format: (value: string) => value });

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

const resource = createLazyResource(async (attempt) => ({ count: attempt }));
const loaded: Promise<{ count: number }> = resource.load();
void loaded;
const explicit: LazyResource<number> = createLazyResource(() => 0);
void explicit;
resource.value?.count.toFixed();
// @ts-expect-error Readonly observation.
resource.attempts = 2;
// @ts-expect-error No unrelated properties inferred as any.
resource.value?.missing;
resourceUrl(new URL("https://example.org/panel.ts"), 2);
// @ts-expect-error URL must be a URL object or string.
resourceUrl(12);
const ready: Promise<void> = loadStylesheet(document.createElement("link"));
void ready;
// @ts-expect-error Only stylesheet links can be loaded.
loadStylesheet(button);

const group: ActionGroup = {
  order(control, click) {
    control.disabled = click.defaultPrevented;
  },
};
createActionRouter([group])(button, event);
createLazyActionRouter({
  features: {
    supplies: {
      names: ["order"],
      load: async (attempt) => {
        attempt.toFixed();
        return group;
      },
    },
  },
  onError(error, action) {
    action.toUpperCase();
    // @ts-expect-error Errors are unknown until narrowed.
    error.message;
  },
})(button, event);
// @ts-expect-error A handler must be a function.
createActionRouter([{ order: 42 }]);

const notes: HistoryAnnotation[] = [{ index: 0, title: "Event", description: "Recorded" }];
const history: HistoryOptions = {
  values: [null, -2, 3],
  labels: ["One", "Two", "Three"],
  minimum: -10,
  annotations: notes,
  plot: "line",
  exactFormat: (value) => value.toFixed(),
};
const html: string = renderHistory(history);
void html;
// @ts-expect-error Plot names are a closed vocabulary.
renderHistory({ plot: "scatter" });
// @ts-expect-error Values cannot contain text.
renderHistory({ values: ["3"] });
const options: HistoryWindowOptions = {
  ...history,
  values: [1],
  labels: ["One"],
  onChange(window) {
    window.end.toFixed();
  },
};
const timeline: HistoryWindow = mountHistoryWindow(root, options);
timeline.setWindow(0, 7);
const total: number = timeline.state.total;
void total;
// @ts-expect-error Readonly state property.
timeline.state = { start: 0, size: 1, end: 1, total: 1 };
// @ts-expect-error Required matching series arrays cannot be omitted.
mountHistoryWindow(root, {});
timeline.destroy();
