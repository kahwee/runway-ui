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
