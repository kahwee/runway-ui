"use client";

import { createElement, type ComponentProps } from "react";
import { cx } from "./classes.ts";

/** Time or workflow controls, such as the day counter and next-day action. */
export function ControlConsole({ className, ...props }: ComponentProps<"footer">) {
  return createElement("footer", { ...props, className: cx("rw-control-console", className) });
}
