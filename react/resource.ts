"use client";

import { createElement, type ReactNode } from "react";
import { AnimatedNumber } from "./animated-number.ts";

export type ResourceProps = { icon?: ReactNode; label: string; value: ReactNode };

/** Number in the resource bar, such as cash or energy. */
export function Resource({ icon, label, value }: ResourceProps) {
  return createElement(
    "div",
    { className: "rw-resource" },
    icon && createElement("span", { className: "rw-resource__icon", "aria-hidden": true }, icon),
    createElement(
      "div",
      null,
      createElement(
        "strong",
        null,
        typeof value === "number" ? createElement(AnimatedNumber, { value }) : value,
      ),
      createElement("small", null, label),
    ),
  );
}
