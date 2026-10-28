"use client";

import { createElement, type ComponentProps, type ReactNode } from "react";
import { cx } from "./classes.ts";

export type PanelProps = Omit<ComponentProps<"section">, "title"> & {
  title?: ReactNode;
  kicker?: ReactNode;
  actions?: ReactNode;
};

/** Surface with an optional kicker, title and header actions. */
export function Panel({ title, kicker, actions, className, children, ...props }: PanelProps) {
  const heading =
    title || kicker || actions
      ? createElement(
          "header",
          { className: "rw-panel__header" },
          createElement(
            "div",
            null,
            kicker && createElement("span", { className: "rw-kicker" }, kicker),
            title && createElement("h2", { className: "rw-panel__title" }, title),
          ),
          actions,
        )
      : null;
  return createElement(
    "section",
    { ...props, className: cx("rw-panel", className) },
    heading,
    children,
  );
}
