"use client";

import { createElement, type ComponentProps, type ReactNode } from "react";
import { cx } from "./classes.ts";
import { AnimatedNumber } from "./animated-number.ts";

export type CommandStat = { label: string; value: ReactNode; note?: ReactNode; icon?: ReactNode };

/** Top status bar: identity on the left, aligned stats on the right. */
export function CommandBar({
  title,
  stats = [],
  className,
  ...props
}: Omit<ComponentProps<"header">, "title"> & { title: ReactNode; stats?: CommandStat[] }) {
  return createElement(
    "header",
    { ...props, className: cx("rw-command-bar", className) },
    createElement(
      "div",
      { className: "rw-command-bar__identity" },
      createElement("strong", null, title),
    ),
    createElement(
      "div",
      { className: "rw-command-bar__metrics" },
      stats.map((stat) =>
        createElement(
          "div",
          { className: "rw-command-stat", key: stat.label },
          createElement("span", null, stat.icon, stat.label),
          createElement(
            "strong",
            null,
            typeof stat.value === "number"
              ? createElement(AnimatedNumber, { value: stat.value })
              : stat.value,
          ),
          stat.note && createElement("small", null, stat.note),
        ),
      ),
    ),
  );
}
