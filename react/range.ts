"use client";

import {
  createElement,
  useId,
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
  style,
  min = 0,
  max = 100,
  defaultValue,
  value: controlledValue,
  id,
  ...props
}: RangeProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [localValue, setValue] = useState(Number(defaultValue ?? min));
  const value = Number(controlledValue ?? localValue);
  const fill =
    Number(max) > Number(min)
      ? Math.min(100, Math.max(0, ((value - Number(min)) / (Number(max) - Number(min))) * 100))
      : 0;
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (controlledValue === undefined) setValue(event.target.valueAsNumber);
    onValueChange?.(event.target.valueAsNumber);
  };
  return createElement(
    "div",
    { className: "rw-field rw-range-field" },
    createElement("label", { htmlFor: inputId }, label),
    createElement("output", { htmlFor: inputId }, format(value)),
    createElement("input", {
      ...props,
      id: inputId,
      type: "range",
      min,
      max,
      value,
      onChange,
      className: cx("rw-range", className),
      style: { ...style, "--rw-fill": `${fill}%` } as CSSProperties,
    }),
  );
}
