"use client";

import { createElement, type ComponentProps } from "react";
import { cx } from "./classes.ts";

export type IconProps = Omit<ComponentProps<"span">, "children"> & {
  /** A Phosphor icon name from the icon stylesheet, such as `coins`, `heart` or `rocket`. */
  name: string;
  weight?: "duotone" | "fill";
  size?: "sm" | "md" | "lg" | "xl";
};

/** Decorative icon drawn with a CSS mask. Give the surrounding control an accessible name. */
export function Icon({ name, weight = "duotone", size, className, ...props }: IconProps) {
  return createElement("span", {
    "aria-hidden": true,
    ...props,
    className: cx("rw-icon", className),
    "data-icon": name,
    "data-weight": weight,
    "data-size": size,
  });
}
