import {
  createElement,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type CSSProperties,
} from "react";
import { cx } from "./classes.ts";

export type RangeProps = Omit<ComponentProps<"input">, "type" | "onChange"> & {
  label: string;
  format?: (value: number) => string;
  onValueChange?: (value: number) => void;
};

/** Native range slider with a filled track and a live `<output>`. */
export function Range({
  label,
  format = String,
  onValueChange,
  className,
  min = 0,
  max = 100,
  defaultValue,
  ...props
}: RangeProps) {
  const [value, setValue] = useState(Number(defaultValue ?? min));
  const fill =
    Number(max) > Number(min) ? ((value - Number(min)) / (Number(max) - Number(min))) * 100 : 0;
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.valueAsNumber);
    onValueChange?.(event.target.valueAsNumber);
  };
  return createElement(
    "label",
    { className: "rw-field" },
    createElement("span", null, label),
    createElement("input", {
      ...props,
      type: "range",
      min,
      max,
      value,
      onChange,
      className: cx("rw-range", className),
      style: { "--rw-fill": `${fill}%` } as CSSProperties,
    }),
    createElement("output", null, format(value)),
  );
}
