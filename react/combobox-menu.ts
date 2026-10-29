"use client";

import { Combobox } from "@base-ui/react/combobox";
import { createElement, type ReactNode } from "react";
import { cx } from "./classes.ts";
import type { MenuOption } from "./select-menu.ts";
import { themeAttr, type RunwayProps } from "./root.ts";

export type ComboboxMenuProps<Value extends string = string> = {
  options: readonly (MenuOption<Value> & { label: string })[];
  value?: Value | null;
  defaultValue?: Value | null;
  onValueChange?: (value: Value | null) => void;
  name?: string;
  id?: string;
  placeholder?: string;
  emptyText?: ReactNode;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
  theme?: RunwayProps["theme"];
};

/** A themed Base UI Combobox: type to filter a list of options, or open it with the chevron. */
export function ComboboxMenu<Value extends string = string>({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  id,
  placeholder = "Search…",
  emptyText = "Nothing matches.",
  disabled,
  className,
  theme = "cozy",
  "aria-label": label,
}: ComboboxMenuProps<Value>) {
  const byValue = new Map(options.map((o) => [o.value, o]));
  const toOption = (v: Value | null) => (v == null ? null : (byValue.get(v) ?? null));
  return createElement(
    Combobox.Root<MenuOption<Value>>,
    {
      items: options,
      name,
      disabled,
      value: value === undefined ? undefined : toOption(value),
      defaultValue: defaultValue === undefined ? undefined : toOption(defaultValue),
      onValueChange: (next: MenuOption<Value> | null) => onValueChange?.(next?.value ?? null),
    },
    createElement(
      Combobox.InputGroup,
      { className: cx("rw-input", "rw-menu-trigger", "rw-combobox", className) },
      createElement(Combobox.Input, {
        id,
        placeholder,
        "aria-label": label,
        className: "rw-combobox-input",
      }),
      createElement(Combobox.Trigger, {
        "aria-label": "Show options",
        className: "rw-menu-chevron-button",
        children: createElement("span", { className: "rw-menu-chevron", "aria-hidden": true }),
      }),
    ),
    createElement(
      Combobox.Portal,
      null,
      createElement(
        Combobox.Positioner,
        { sideOffset: 6, className: "rw-menu-positioner" },
        createElement(
          Combobox.Popup,
          { className: "rw-ui rw-menu", ...themeAttr(theme) },
          createElement(Combobox.Empty, { className: "rw-menu-empty" }, emptyText),
          createElement(Combobox.List, {
            className: "rw-menu-list",
            children: (option: MenuOption<Value>) =>
              createElement(
                Combobox.Item,
                {
                  key: option.value,
                  value: option,
                  disabled: option.disabled,
                  className: "rw-menu-item",
                },
                createElement("span", null, option.label),
                createElement(Combobox.ItemIndicator, { className: "rw-menu-check" }, "✓"),
              ),
          }),
        ),
      ),
    ),
  );
}
