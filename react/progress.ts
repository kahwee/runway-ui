"use client";

import { createElement, type ComponentProps } from "react";
import { cx } from "./classes.ts";

/** Native progress semantics; omit value for indeterminate work. Supply an accessible name. */
export function Progress({ className, ...props }: ComponentProps<"progress">) {
  return createElement("progress", {
    ...props,
    className: cx("rw-progress", className),
  });
}
