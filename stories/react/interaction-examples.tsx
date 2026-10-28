import { useState } from "react";
import { Button, Inventory, Range } from "../../react/index.ts";
import { bounded } from "../helpers.ts";

export interface RangeExampleProps {
  label: string;
  value: number;
  disabled: boolean;
  width: number;
}

/** The preset changes parent state, so it also exercises controlled updates. */
export function RangeExample({ label, value: initialValue, disabled, width }: RangeExampleProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <section
      className="react-form-example"
      style={{ maxInlineSize: `${bounded(width, 220, 640, 420)}px` }}
    >
      <Range
        label={label}
        value={value}
        onValueChange={setValue}
        disabled={disabled}
        min={0}
        max={100}
        step={5}
        format={(amount) => `${amount}%`}
        style={{ accentColor: "var(--rw-accent)" }}
      />
      <Button disabled={disabled} onClick={() => setValue(75)}>
        Use balanced allocation
      </Button>
      <p className="rw-muted">
        Use arrow keys to adjust by 5. The preset updates the slider, fill and output together.
      </p>
    </section>
  );
}

export interface InventoryExampleProps {
  disabled: boolean;
  empty: boolean;
  width: number;
}
const supplies = [
  { id: "reserved", label: "Reserved", icon: "○", disabled: true },
  { id: "seeds", label: "Seeds", icon: "❋" },
  { id: "locked", label: "Locked", icon: "◇", disabled: true },
  { id: "water", label: "Water", icon: "◒" },
  { id: "tools", label: "Tools", icon: "⚒" },
  { id: "unavailable", label: "Unavailable", icon: "○", disabled: true },
];

export function InventoryExample({ disabled, empty, width }: InventoryExampleProps) {
  const [selectedId, setSelectedId] = useState<string>();
  const [removed, setRemoved] = useState(false);
  const [reversed, setReversed] = useState(false);
  let items = empty ? [] : supplies.filter((item) => !removed || item.id !== "seeds");
  if (reversed) items = [...items].reverse();
  if (disabled) items = items.map((item) => ({ ...item, disabled: true }));
  return (
    <section
      className="react-form-example"
      style={{ maxInlineSize: `${bounded(width, 220, 640, 420)}px` }}
    >
      <h2>Supply cabinet</h2>
      <Inventory
        label="Supplies"
        items={items}
        columns={3}
        selected={items.findIndex((item) => item.id === selectedId)}
        onSelect={(item) => setSelectedId(item.id)}
      />
      {empty && <p>The cabinet is empty.</p>}
      <p role="status">
        {items.find((item) => item.id === selectedId)?.label ?? "Nothing"} selected
      </p>
      <Button disabled={empty} onClick={() => setReversed((value) => !value)}>
        Reverse slots
      </Button>
      <Button disabled={empty || removed} onClick={() => setRemoved(true)}>
        Remove seeds
      </Button>
      <p className="rw-muted">
        Arrows move between available slots. Home and End jump to the first and last available item.
      </p>
    </section>
  );
}
