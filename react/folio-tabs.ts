"use client";

import { createElement, type ReactNode } from "react";
import { cx } from "./classes.ts";

export type FolioTabsProps<Id extends string> = {
  label: string;
  items: { id: Id; label: ReactNode }[];
  value: Id;
  onValueChange: (id: Id) => void;
  className?: string;
};

/** Vertical section navigation. The current destination uses `aria-current="page"`. */
export function FolioTabs<Id extends string>({
  label,
  items,
  value,
  onValueChange,
  className,
}: FolioTabsProps<Id>) {
  return createElement(
    "nav",
    { className: cx("rw-folio-tabs", className), "aria-label": label },
    items.map((item) =>
      createElement(
        "button",
        {
          key: item.id,
          type: "button",
          className: "rw-folio-tab",
          "aria-current": item.id === value ? "page" : undefined,
          onClick: () => onValueChange(item.id),
        },
        item.label,
      ),
    ),
  );
}
