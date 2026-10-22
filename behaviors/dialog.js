/** Optional native modal policy. The browser owns focus and background inertness. */
export function bindDialog(dialog, { canDismiss = () => true } = {}) {
  if (
    dialog?.localName !== "dialog" ||
    typeof dialog.showModal !== "function" ||
    typeof dialog.requestClose !== "function" ||
    !("closedBy" in dialog)
  ) {
    throw new TypeError(
      "bindDialog requires a native HTMLDialogElement with requestClose() and closedBy",
    );
  }
  if (typeof canDismiss !== "function") throw new TypeError("canDismiss must be a function");
  const originalClosedBy = dialog.getAttribute("closedby");
  let destroyed = false;

  function refresh() {
    if (!destroyed) dialog.setAttribute("closedby", canDismiss() ? "any" : "none");
  }
  function cancel(event) {
    if (!canDismiss()) event.preventDefault();
  }
  function requestClose(returnValue) {
    if (destroyed || !dialog.open || !canDismiss()) return false;
    if (returnValue === undefined) dialog.requestClose();
    else dialog.requestClose(returnValue);
    return true; // A request was issued; another cancel listener can still prevent closing.
  }
  dialog.addEventListener("cancel", cancel);

  return {
    open() {
      if (destroyed) return;
      refresh();
      if (!dialog.open) dialog.showModal();
    },
    refresh,
    requestClose,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      dialog.removeEventListener("cancel", cancel);
      if (originalClosedBy === null) dialog.removeAttribute("closedby");
      else dialog.setAttribute("closedby", originalClosedBy);
    },
  };
}
