import { createElement, createRef } from "react";
import { Button, Checkbox, Field, Input, Select } from "@kahwee/runway-ui/react";

createElement(
  Button,
  {
    ref: createRef<HTMLButtonElement>(),
    className: (state) => (state.disabled ? "unavailable" : "ready"),
    onClick: (event) => event.currentTarget.focus(),
  },
  "Save",
);
createElement(
  Field.Root,
  null,
  createElement(Field.Label, null, "Workspace"),
  createElement(Input, {
    ref: createRef<HTMLInputElement>(),
    onValueChange: (value) => value.toUpperCase(),
  }),
);
createElement(Checkbox.Root, { onCheckedChange: (checked) => Boolean(checked) });
createElement(Select.Root<string>, {
  value: "steady",
  onValueChange: (value) => value?.toUpperCase(),
});
// @ts-expect-error Base UI retains its boolean disabled contract.
createElement(Button, { disabled: "yes" });

// The public facade must preserve each extracted owner's props and generic inference.
import {
  CommandBar,
  Dossier,
  FolioTabs,
  Inventory,
  Meter,
  Range,
  Resource,
  type CommandStat,
  type DossierProps,
  type InventoryProps,
  type Tone,
} from "@kahwee/runway-ui/react";
const tone: Tone = "morale";
createElement(Meter, { label: "Energy", value: 72, tone });
const stats: CommandStat[] = [{ label: "Day", value: 3 }];
createElement(CommandBar, { title: "Briefing", stats });
const dossier: DossierProps = { title: "Research", actions: "Review" };
createElement(Dossier, dossier);
createElement(Resource, { label: "Supplies", value: 8 });
createElement(Range, { label: "Allocation", value: 25, onValueChange: (value) => value.toFixed() });
createElement(FolioTabs<"overview" | "supplies">, {
  label: "Sections",
  items: [{ id: "overview", label: "Overview" }],
  value: "overview",
  onValueChange: (value) => {
    const selected: "overview" | "supplies" = value;
    void selected;
  },
});
const inventory: InventoryProps<{ id: string; label: string; cost: number }> = {
  items: [{ id: "seeds", label: "Seeds", cost: 2 }],
  onSelect: (item) => item.cost.toFixed(),
};
createElement(Inventory<{ id: string; label: string; cost: number }>, inventory);
// @ts-expect-error Range callbacks receive numeric values.
createElement(Range, { label: "Allocation", onValueChange: (value: string) => value });
// @ts-expect-error Named tones remain a closed public contract.
createElement(Meter, { label: "Energy", value: 72, tone: "unknown" });

import { InputScope, InputHints, type InputBinding } from "@kahwee/runway-ui/react";
const bindings: InputBinding[] = [
  { id: "next", label: "Next cycle", key: "n", onActivate: () => {} },
];
createElement(InputScope, {
  ref: createRef<HTMLDivElement>(),
  bindings,
  gamepad: true,
  columns: 3,
});
createElement(InputHints, { bindings });
const invalidBinding: InputBinding = {
  id: "next",
  label: "Next",
  key: "n",
  // @ts-expect-error Application callbacks do not receive synthetic key or gamepad events.
  onActivate: (event: KeyboardEvent) => event.preventDefault(),
};
void invalidBinding;
