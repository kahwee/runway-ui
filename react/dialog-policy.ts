export type DialogPolicy = {
  canDismiss: () => boolean;
  onClose: (returnValue: string) => void;
};

/** Local compatibility only. Native dialog opening, focus and inertness stay with the browser. */
export function attachDialogPolicy(dialog: HTMLDialogElement, policy: () => DialogPolicy) {
  const nativeLightDismiss = Reflect.has(dialog, "closedBy");
  let pressed: number | null = null;
  const reset = () => {
    pressed = null;
  };
  const cancel = (event: Event) => {
    if (!policy().canDismiss()) event.preventDefault();
  };
  const close = () => {
    reset();
    policy().onClose(dialog.returnValue);
  };
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
    pressed =
      event.button === 0 && event.isPrimary !== false && outside(event) ? event.pointerId : null;
  };
  const up = (event: PointerEvent) => {
    const same = pressed === event.pointerId;
    reset();
    if (
      !same ||
      event.button !== 0 ||
      event.isPrimary === false ||
      !outside(event) ||
      !dialog.open ||
      !policy().canDismiss()
    )
      return;
    if (typeof dialog.requestClose === "function") dialog.requestClose();
    else {
      const CancelEvent = dialog.ownerDocument.defaultView?.Event ?? Event;
      if (dialog.dispatchEvent(new CancelEvent("cancel", { cancelable: true }))) dialog.close();
    }
  };
  dialog.addEventListener("cancel", cancel);
  dialog.addEventListener("close", close);
  if (!nativeLightDismiss) {
    dialog.addEventListener("pointerdown", down);
    dialog.addEventListener("pointerup", up);
    dialog.addEventListener("pointercancel", reset);
  }
  return () => {
    dialog.removeEventListener("cancel", cancel);
    dialog.removeEventListener("close", close);
    dialog.removeEventListener("pointerdown", down);
    dialog.removeEventListener("pointerup", up);
    dialog.removeEventListener("pointercancel", reset);
    reset();
  };
}
