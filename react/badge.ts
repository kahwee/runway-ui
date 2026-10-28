"use client";

import { createElement, type ComponentProps } from "react";
import { cx } from "./classes.ts";

export type BadgeProps = ComponentProps<"span"> & { tone?: "warning" | "danger" };

/** Small sticker for status. */
export function Badge({ tone, className, ...props }: BadgeProps) {
  return createElement("span", {
    ...props,
    className: cx("rw-badge", className),
    "data-tone": tone,
  });
}
