import { useState } from "react";
import { ComboboxMenu, Popover, SelectMenu } from "../../react/index.ts";
import { bounded } from "../helpers.ts";

const stages = [
  { value: "garage", label: "Garage" },
  { value: "studio", label: "Studio" },
  { value: "office", label: "Office floor" },
  { value: "campus", label: "Campus", disabled: true },
];
const markets = [
  { value: "dev", label: "Developer tools" },
  { value: "fintech", label: "Fintech" },
  { value: "games", label: "Games" },
  { value: "health", label: "Health" },
  { value: "retail", label: "Retail" },
];

export interface MenusExampleProps {
  width: number;
  disabled: boolean;
}
export function MenusExample({ width, disabled }: MenusExampleProps) {
  const [stage, setStage] = useState("garage");
  const [market, setMarket] = useState<string | null>(null);
  return (
    <section
      className="react-form-example"
      style={{ maxInlineSize: `${bounded(width, 240, 640, 380)}px`, display: "grid", gap: 16 }}
    >
      <label>
        Company stage
        <SelectMenu
          aria-label="Company stage"
          options={stages}
          value={stage}
          onValueChange={setStage}
          disabled={disabled}
        />
      </label>
      <label>
        Kind of company
        <ComboboxMenu
          aria-label="Kind of company"
          options={markets}
          value={market}
          onValueChange={setMarket}
          disabled={disabled}
        />
      </label>
      <Popover trigger="What are stages?" title="Company stages">
        <p style={{ margin: 0 }}>Each stage changes your starting cash, desks and staff.</p>
      </Popover>
      <p role="status">
        {stage} · {market ?? "no market yet"}
      </p>
    </section>
  );
}
