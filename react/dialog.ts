import { createElement, useEffect, useRef, type ComponentProps } from "react";
import { cx } from "./classes.ts";

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
    const nativeLightDismiss = Reflect.has(dialog, "closedBy");
    const cancel = (event: Event) => {
      if (!policy.current.canDismiss()) event.preventDefault();
    };
    const close = () => policy.current.onClose(dialog.returnValue);
    let pressed: number | null = null;
    const outside = (event: PointerEvent) => {
      if (event.target !== dialog) return false;
      const rect = dialog.getBoundingClientRect();
      return (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      );
    };
    const down = (event: PointerEvent) => {
      pressed = event.button === 0 && outside(event) ? event.pointerId : null;
    };
    const up = (event: PointerEvent) => {
      const same = pressed === event.pointerId;
      pressed = null;
      if (same && event.button === 0 && outside(event) && policy.current.canDismiss())
        dialog.requestClose?.();
    };
    dialog.addEventListener("cancel", cancel);
    dialog.addEventListener("close", close);
    if (!nativeLightDismiss) {
      dialog.addEventListener("pointerdown", down);
      dialog.addEventListener("pointerup", up);
    }
    return () => {
      dialog.removeEventListener("cancel", cancel);
      dialog.removeEventListener("close", close);
      dialog.removeEventListener("pointerdown", down);
      dialog.removeEventListener("pointerup", up);
    };
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
