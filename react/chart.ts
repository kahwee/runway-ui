"use client";

import { createElement, type ReactNode } from "react";
import { cx } from "./classes.ts";

export { defineChart } from "@tanstack/charts";
export { Chart } from "@tanstack/charts/react";

/** Card for a chart. Inside a themed `Runway` root the chart inherits its palette. */
export function ChartCard({
  title,
  caption,
  className,
  children,
}: {
  title: ReactNode;
  caption?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return createElement(
    "figure",
    { className: cx("rw-panel", "rw-figure", className), style: { margin: 0 } },
    createElement("figcaption", { className: "rw-panel__title" }, title),
    caption && createElement("p", { className: "rw-muted" }, caption),
    children,
  );
}
