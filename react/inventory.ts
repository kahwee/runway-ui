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
  const [active, setActive] = useState(0);
  const slots = useRef<(HTMLButtonElement | null)[]>([]);
  const focus = (index: number) => {
    const next = Math.min(items.length - 1, Math.max(0, index));
    setActive(next);
    slots.current[next]?.focus();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    const step: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -columns,
      ArrowDown: columns,
    };
    if (event.key in step) focus(active + step[event.key]);
    else if (event.key === "Home") focus(0);
    else if (event.key === "End") focus(items.length - 1);
    else return;
    event.preventDefault();
  };
  return createElement(
    "div",
    {
      className: className ? `rw-slots ${className}` : "rw-slots",
      role: "group",
      "aria-label": label,
      style: { "--rw-columns": columns } as CSSProperties,
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
          onFocus: () => setActive(index),
          onClick: () => onSelect?.(item, index),
        },
        item.icon &&
          createElement("span", { className: "rw-slot__icon", "aria-hidden": true }, item.icon),
        createElement("small", null, item.label),
      ),
    ),
  );
}
