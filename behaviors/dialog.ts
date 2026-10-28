export type DialogController = {
  /**
   * Opens with the current native dismissal policy.
   */
  open: () => void;
  /**
   * Reapplies dismissal policy while open.
   */
  refresh: () => void;
  /**
   * True means issued; another cancel listener may still prevent closure.
   */
  requestClose: (returnValue?: string) => boolean;
  /**
   * Restores the original closedby attribute and removes listeners; does not close the dialog.
   */
  destroy: () => void;
};

/** Optional native modal policy. The browser owns focus and background inertness. */

export function bindDialog(
  dialog: HTMLDialogElement,
  {
    canDismiss = () => true,
  }: {
    canDismiss?: () => boolean;
  } = {},
): DialogController {
  if (
    dialog?.localName !== "dialog" ||
    typeof dialog.showModal !== "function" ||
    typeof dialog.close !== "function"
  ) {
    throw new TypeError(
      "bindDialog requires a native HTMLDialogElement with showModal() and close()",
    );
  }
  if (typeof canDismiss !== "function") throw new TypeError("canDismiss must be a function");
  const originalClosedBy = dialog.getAttribute("closedby");
  const nativeLightDismiss = Reflect.has(dialog, "closedBy");
  let destroyed = false;

  let backdropPointer: number | null = null;

  function refresh() {
    if (!destroyed)
      dialog.setAttribute(
        "closedby",
        canDismiss() ? (nativeLightDismiss ? "any" : "closerequest") : "none",
      );
  }

  function cancel(event: Event) {
    if (!canDismiss()) event.preventDefault();
  }

  function requestClose(returnValue?: string) {
    if (destroyed || !dialog.open || !canDismiss()) return false;
    if (typeof dialog.requestClose === "function") {
      if (returnValue === undefined) dialog.requestClose();
      else dialog.requestClose(returnValue);
    } else {
      const CancelEvent = dialog.ownerDocument?.defaultView?.Event ?? Event;
      if (dialog.dispatchEvent(new CancelEvent("cancel", { cancelable: true }))) {
        if (returnValue === undefined) dialog.close();
        else dialog.close(returnValue);
      }
    }
    return true; // A request was issued; another cancel listener can still prevent closing.
  }

  function outside(event: PointerEvent) {
    if (event.target !== dialog) return false;
    const rect = dialog.getBoundingClientRect();
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    );
  }
  function resetPointer() {
    backdropPointer = null;
  }

  function pointerDown(event: PointerEvent) {
    backdropPointer =
      event.button === 0 && event.isPrimary !== false && outside(event) ? event.pointerId : null;
  }

  function pointerUp(event: PointerEvent) {
    const samePointer = backdropPointer === event.pointerId;
    resetPointer();
    if (samePointer && event.isPrimary !== false && event.button === 0 && outside(event))
      requestClose();
  }
  dialog.addEventListener("cancel", cancel);
  if (!nativeLightDismiss) {
    dialog.addEventListener("pointerdown", pointerDown);
    dialog.addEventListener("pointerup", pointerUp);
    dialog.addEventListener("pointercancel", resetPointer);
    dialog.addEventListener("close", resetPointer);
  }

  return {
    open() {
      if (destroyed) return;
      resetPointer();
      refresh();
      // Native showModal rejects nonmodal state and is idempotent when already modal.
      dialog.showModal();
    },
    refresh,
    requestClose,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      dialog.removeEventListener("cancel", cancel);
      dialog.removeEventListener("pointerdown", pointerDown);
      dialog.removeEventListener("pointerup", pointerUp);
      dialog.removeEventListener("pointercancel", resetPointer);
      dialog.removeEventListener("close", resetPointer);
      resetPointer();
      if (originalClosedBy === null) dialog.removeAttribute("closedby");
      else dialog.setAttribute("closedby", originalClosedBy);
    },
  };
}
