"use client";

import { createElement, type ComponentProps, type ReactNode } from "react";
import { cx } from "./classes.ts";

export type DossierProps = {
  kicker?: ReactNode;
  status?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

/** One record: body and actions align to shared columns with the other dossiers in the list. */
export function Dossier({ kicker, status, title, description, actions }: DossierProps) {
  return createElement(
    "article",
    { className: "rw-dossier" },
    createElement(
      "div",
      { className: "rw-dossier__body" },
      (kicker || status) &&
        createElement(
          "div",
          { className: "rw-dossier__heading" },
          kicker && createElement("span", { className: "rw-kicker" }, kicker),
          status,
        ),
      createElement("h3", null, title),
      description && createElement("p", null, description),
    ),
    actions && createElement("div", { className: "rw-dossier__actions" }, actions),
  );
}

export function DossierList({ className, ...props }: ComponentProps<"div">) {
  return createElement("div", { ...props, className: cx("rw-dossier-list", className) });
}
