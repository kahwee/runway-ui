/**
 * @typedef {object} DialogController
 * @property {() => void} open Opens with the current native dismissal policy.
 * @property {() => void} refresh Reapplies dismissal policy while open.
 * @property {(returnValue?: string) => boolean} requestClose True means issued; another cancel listener may still prevent closure.
 * @property {() => void} destroy Restores the original closedby attribute and removes listeners; does not close the dialog.
 */
/** Optional native modal policy. The browser owns focus and background inertness. */
/** @param {HTMLDialogElement} dialog @param {{canDismiss?: () => boolean}} [options] @returns {DialogController} */
export function bindDialog(dialog, { canDismiss = () => true } = {}) {
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
  /** @type {number | null} */
  let backdropPointer = null;

  function refresh() {
    if (!destroyed)
      dialog.setAttribute(
        "closedby",
        canDismiss() ? (nativeLightDismiss ? "any" : "closerequest") : "none",
      );
  }
  /** @param {Event} event */
  function cancel(event) {
    if (!canDismiss()) event.preventDefault();
  }
  /** @param {string} [returnValue] */
  function requestClose(returnValue) {
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
  /** @param {PointerEvent} event */
  function outside(event) {
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
  /** @param {PointerEvent} event */
  function pointerDown(event) {
    backdropPointer =
      event.button === 0 && event.isPrimary !== false && outside(event) ? event.pointerId : null;
  }
  /** @param {PointerEvent} event */
  function pointerUp(event) {
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
