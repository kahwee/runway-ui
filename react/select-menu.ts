"use client";

import { Select } from "@base-ui/react/select";
import { createElement, type ReactNode } from "react";
import { cx } from "./classes.ts";
import { themeAttr, type RunwayProps } from "./root.ts";

export type MenuOption<Value extends string = string> = {
  value: Value;
  label: ReactNode;
  disabled?: boolean;
};

export type SelectMenuProps<Value extends string = string> = {
  options: readonly MenuOption<Value>[];
  value?: Value | null;
  defaultValue?: Value | null;
  onValueChange?: (value: Value) => void;
  name?: string;
  id?: string;
  placeholder?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  "aria-label"?: string;
  className?: string;
  /** Theme for the portaled list, which renders outside the `Runway` root. */
  theme?: RunwayProps["theme"];
  /** Where the list portals to. Pass the enclosing native `<dialog>` so it stays above a modal. */
  container?: HTMLElement | null;
};

/** A themed Base UI Select: styled trigger, popup, items and check mark in one component. */
export function SelectMenu<Value extends string = string>({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  id,
  placeholder,
  disabled,
  required,
  className,
  theme = "cozy",
  container,
  "aria-label": label,
}: SelectMenuProps<Value>) {
  return createElement(
    Select.Root<Value>,
    {
      items: options,
      value,
      defaultValue,
      name,
      disabled,
      required,
      onValueChange: (next: Value | null) => next !== null && onValueChange?.(next),
    },
    createElement(
      Select.Trigger,
      { id, "aria-label": label, className: cx("rw-input", "rw-menu-trigger", className) },
      createElement(Select.Value, {
        className: "rw-menu-value",
        children: (selected: Value | null) =>
          options.find((o) => o.value === selected)?.label ??
          createElement("span", { className: "rw-menu-placeholder" }, placeholder ?? "Choose…"),
      }),
      createElement(
        Select.Icon,
        { className: "rw-menu-icon" },
        createElement("span", { className: "rw-menu-chevron" }),
      ),
    ),
    createElement(
      Select.Portal,
      { container },
      createElement(
        Select.Positioner,
        { sideOffset: 6, alignItemWithTrigger: false, className: "rw-menu-positioner" },
        createElement(
          Select.Popup,
          { className: "rw-ui rw-menu", ...themeAttr(theme) },
          createElement(
            Select.List,
            { className: "rw-menu-list" },
            options.map((option) =>
              createElement(
                Select.Item,
                {
                  key: option.value,
                  value: option.value,
                  disabled: option.disabled,
                  className: "rw-menu-item",
                },
                createElement(Select.ItemText, null, option.label),
                createElement(Select.ItemIndicator, { className: "rw-menu-check" }, "✓"),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
