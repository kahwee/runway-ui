"use client";

import { createElement, useImperativeHandle, useRef, type ComponentProps } from "react";
import { cx } from "./classes.ts";
import { matchesBinding, type InputBinding } from "./input-bindings.ts";
import { moveInputFocus, ownsInput, focusItems, type InputDirection } from "./input-navigation.ts";
import { useGamepadInput, type GamepadCommand } from "./gamepad-input.ts";

export type InputScopeProps = ComponentProps<"div"> & {
  bindings?: readonly InputBinding[];
  columns?: number;
  loop?: boolean;
  gamepad?: boolean;
  onBack?: () => void;
};

/** Local shortcuts and optional directional/gamepad input. Native Tab and widgets remain native. */
export function InputScope({
  bindings = [],
  columns = 1,
  loop = false,
  gamepad = false,
  onBack,
  onKeyDown,
  className,
  ref,
  ...props
}: InputScopeProps) {
  const root = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => root.current!, []);
  const command = useRef<(command: GamepadCommand) => void>(() => {});
  command.current = (action) => {
    const element = root.current;
    if (!element || !ownsInput(element, element.ownerDocument.activeElement)) return;
    if (action === "back") onBack?.();
    else if (action === "activate") {
      const active = element.ownerDocument.activeElement;
      if (focusItems(element).includes(active as HTMLElement)) (active as HTMLElement).click();
    } else moveInputFocus(element, action, columns, loop);
  };
  useGamepadInput(root, gamepad, command);
  return createElement("div", {
    role: "group",
    ...props,
    ref: root,
    className: cx("rw-input-scope", className),
    "data-rw-input-scope": "",
    onKeyDown: (event) => {
      onKeyDown?.(event);
      if (
        event.defaultPrevented ||
        event.nativeEvent.isComposing ||
        !root.current ||
        !ownsInput(root.current, event.target as Element)
      )
        return;
      if (
        event.key === "Tab" ||
        ((event.key === "Enter" || event.key === " ") &&
          (event.target as Element).closest("button,a[href],summary"))
      )
        return;
      const binding = bindings.find((binding) => matchesBinding(event.nativeEvent, binding));
      if (binding) {
        event.preventDefault();
        binding.onActivate();
        return;
      }
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const direction = (
        {
          ArrowLeft: "left",
          ArrowRight: "right",
          ArrowUp: "up",
          ArrowDown: "down",
          Home: "first",
          End: "last",
        } as Record<string, InputDirection>
      )[event.key];
      if (direction && moveInputFocus(root.current, direction, columns, loop))
        event.preventDefault();
    },
  });
}
