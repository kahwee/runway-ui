"use client";

import { createElement, type ComponentProps } from "react";
import { cx } from "./classes.ts";
import { bindingKeys, type InputBinding } from "./input-bindings.ts";

export type InputHintsProps = Omit<ComponentProps<"ul">, "children"> & {
  bindings: readonly InputBinding[];
};

/** Visible shortcut labels derived from the same remappable bindings used by InputScope. */
export function InputHints({ bindings, className, ...props }: InputHintsProps) {
  return createElement(
    "ul",
    { "aria-label": "Keyboard shortcuts", ...props, className: cx("rw-input-hints", className) },
    bindings.map((binding) =>
      createElement(
        "li",
        { key: binding.id },
        createElement("kbd", { className: "rw-shortcut" }, bindingKeys(binding)),
        createElement("span", null, binding.label),
      ),
    ),
  );
}
