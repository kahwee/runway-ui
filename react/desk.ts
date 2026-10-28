import { createElement, type ComponentProps, type ReactNode } from "react";
import { cx } from "./classes.ts";

export type CommandStat = { label: string; value: ReactNode; note?: ReactNode };

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
          createElement("span", null, stat.label),
          createElement("strong", null, stat.value),
          stat.note && createElement("small", null, stat.note),
        ),
      ),
    ),
  );
}

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

/** Time or workflow controls, such as the day counter and next-day action. */
export function ControlConsole({ className, ...props }: ComponentProps<"footer">) {
  return createElement("footer", { ...props, className: cx("rw-control-console", className) });
}
