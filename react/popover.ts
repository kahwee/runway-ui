"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";
import { createElement, type ReactNode } from "react";
import { cx } from "./classes.ts";
import { themeAttr, type RunwayProps } from "./root.ts";

export type PopoverProps = {
  /** The control that opens the popover. Rendered as a `rw-button`. */
  trigger: ReactNode;
  title?: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  theme?: RunwayProps["theme"];
  /** Where the list portals to. Pass the enclosing native `<dialog>` so it stays above a modal. */
  container?: HTMLElement | null;
};

/** A themed Base UI Popover for small, non-modal panels anchored to a button. */
export function Popover({
  trigger,
  title,
  children,
  open,
  defaultOpen,
  onOpenChange,
  side = "bottom",
  className,
  theme = "cozy",
  container,
}: PopoverProps) {
  return createElement(
    BasePopover.Root,
    { open, defaultOpen, onOpenChange },
    createElement(BasePopover.Trigger, {
      className: "rw-button",
      ...({ "data-variant": "secondary" } as object),
      children: trigger,
    }),
    createElement(
      BasePopover.Portal,
      { container: container ?? undefined },
      createElement(
        BasePopover.Positioner,
        { side, sideOffset: 8, className: "rw-menu-positioner" },
        createElement(
          BasePopover.Popup,
          { className: cx("rw-ui", "rw-popover", className), ...themeAttr(theme) },
          title && createElement(BasePopover.Title, { className: "rw-popover-title" }, title),
          children,
        ),
      ),
    ),
  );
}
