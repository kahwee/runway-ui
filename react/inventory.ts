import {
  createElement,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type InventoryItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  rarity?: "rare";
  disabled?: boolean;
};

export type InventoryProps<T extends InventoryItem> = {
  items: T[];
  columns?: number;
  /** Index of the selected slot, or -1 for none. */
  selected?: number;
  onSelect?: (item: T, index: number) => void;
  label?: string;
  className?: string;
};

/** Slot grid with roving focus: arrows move, Home and End jump, Enter or Space selects. */
export function Inventory<T extends InventoryItem>({
  items,
  columns = 6,
  selected = -1,
  onSelect,
  label = "Inventory",
  className,
}: InventoryProps<T>) {
  const [activeId, setActiveId] = useState<string>();
  const enabled = items.flatMap((item, index) => (item.disabled ? [] : [index]));
  const remembered = items.findIndex((item) => item.id === activeId && !item.disabled);
  const active = remembered >= 0 ? remembered : (enabled[0] ?? -1);
  const columnCount = Number.isFinite(columns) ? Math.max(1, Math.floor(columns)) : 6;
  const slots = useRef<(HTMLButtonElement | null)[]>([]);
  const focus = (index: number) => {
    if (index < 0 || !items[index] || items[index].disabled) return;
    setActiveId(items[index].id);
    slots.current[index]?.focus();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    const step: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -columnCount,
      ArrowDown: columnCount,
    };
    if (event.key in step) {
      const delta = step[event.key];
      let next = active + delta;
      while (next >= 0 && next < items.length && items[next].disabled) next += delta;
      focus(next);
    } else if (event.key === "Home") focus(enabled[0] ?? -1);
    else if (event.key === "End") focus(enabled.at(-1) ?? -1);
    else return;
    event.preventDefault();
  };
  return createElement(
    "div",
    {
      className: className ? `rw-slots ${className}` : "rw-slots",
      role: "group",
      "aria-label": label,
      style: { "--rw-columns": columnCount } as CSSProperties,
      onKeyDown,
    },
    items.map((item, index) =>
      createElement(
        "button",
        {
          key: item.id,
          ref: (element: HTMLButtonElement | null) => {
            slots.current[index] = element;
          },
          type: "button",
          className: "rw-slot",
          tabIndex: index === active ? 0 : -1,
          disabled: item.disabled,
          "aria-pressed": index === selected,
          "data-rarity": item.rarity,
          onFocus: () => setActiveId(item.id),
          onClick: () => onSelect?.(item, index),
        },
        item.icon &&
          createElement("span", { className: "rw-slot__icon", "aria-hidden": true }, item.icon),
        createElement("small", null, item.label),
      ),
    ),
  );
}
