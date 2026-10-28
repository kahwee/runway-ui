"use client";

import { createElement, type ComponentProps, type ReactNode } from "react";
import { cx } from "./classes.ts";

/** Paper section with a heading and optional description. */
export function Sheet({
  title,
  description,
  className,
  children,
  ...props
}: Omit<ComponentProps<"section">, "title"> & { title: ReactNode; description?: ReactNode }) {
  return createElement(
    "section",
    { ...props, className: cx("rw-sheet", className) },
    createElement("h2", null, title),
    description && createElement("p", null, description),
    children,
  );
}
