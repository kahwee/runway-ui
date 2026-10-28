"use client";

import { createElement, useEffect, useRef, type ComponentProps } from "react";
import { cx } from "./classes.ts";
import { attachDialogPolicy } from "./dialog-policy.ts";

export type DialogProps = Omit<ComponentProps<"dialog">, "open" | "onClose"> & {
  open: boolean;
  /** Called after the native dialog closes, with its return value. */
  onClose: (returnValue: string) => void;
  /** Return false to veto Escape, backdrop and close-request dismissal for required decisions. */
  canDismiss?: () => boolean;
};

/**
 * Native modal dialog. The browser owns focus and background inertness; this component
 * adds the dismissal policy and keeps `open` in sync with `showModal()` and `close()`.
 */
export function Dialog({
  open,
  onClose,
  canDismiss = () => true,
  className,
  ...props
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const policy = useRef({ canDismiss, onClose });
  policy.current = { canDismiss, onClose };

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    return attachDialogPolicy(dialog, () => policy.current);
  }, []);

  // Reapply the dismissal policy on every render so a changed `canDismiss` takes effect.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const nativeLightDismiss = Reflect.has(dialog, "closedBy");
    dialog.setAttribute(
      "closedby",
      canDismiss() ? (nativeLightDismiss ? "any" : "closerequest") : "none",
    );
  });

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return createElement("dialog", { ...props, ref, className: cx("rw-dialog", className) });
}
