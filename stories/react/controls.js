import { createElement as h, useState } from "react";
import { Button, Field, Input } from "../../react/index.js";
import { bounded } from "../helpers.js";

export function ButtonExample({ label, variant, size, disabled, width }) {
  const [clicks, setClicks] = useState(0);
  return h(
    "section",
    {
      className: "react-form-example",
      style: { maxInlineSize: `${bounded(width, 220, 640, 420)}px` },
    },
    h(
      Button,
      {
        "data-variant": variant,
        "data-size": size,
        disabled,
        onClick: () => setClicks((value) => value + 1),
      },
      label,
    ),
    h("p", { role: "status" }, `${clicks} activation${clicks === 1 ? "" : "s"}`),
  );
}

export function InputExample({
  label,
  value: initialValue,
  placeholder,
  description,
  disabled,
  readOnly,
  required,
  type,
  width,
}) {
  const [value, setValue] = useState(initialValue);
  return h(
    "section",
    {
      className: "react-form-example",
      style: { maxInlineSize: `${bounded(width, 220, 640, 420)}px` },
    },
    h(
      Field.Root,
      { className: "rw-field", disabled },
      h(Field.Label, null, label),
      h(Input, { value, onValueChange: setValue, placeholder, disabled, readOnly, required, type }),
      description ? h(Field.Description, null, description) : null,
    ),
    h("p", { className: "rw-muted" }, "Edit the preview directly. Args reset the initial value."),
  );
}
