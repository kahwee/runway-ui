/** Optional native modal policy. The browser owns focus and background inertness. */
export function bindDialog(dialog, { canDismiss = () => true } = {}) {
  if (dialog?.localName !== "dialog" || typeof dialog.showModal !== "function") {
    throw new TypeError("bindDialog requires a native HTMLDialogElement");
  }
  if (typeof canDismiss !== "function") throw new TypeError("canDismiss must be a function");
  const originalClosedBy = dialog.getAttribute("closedby");
  let destroyed = false;

  function refresh() {
    if (!destroyed) dialog.setAttribute("closedby", canDismiss() ? "closerequest" : "none");
  }
  function cancel(event) {
    if (!canDismiss()) event.preventDefault();
  }
  function requestClose(returnValue) {
    if (destroyed || !dialog.open || !canDismiss()) return false;
    if (typeof dialog.requestClose === "function") {
      if (returnValue === undefined) dialog.requestClose();
      else dialog.requestClose(returnValue);
    } else {
      const EventType = dialog.ownerDocument.defaultView.Event;
      if (dialog.dispatchEvent(new EventType("cancel", { cancelable: true }))) {
        if (returnValue === undefined) dialog.close();
        else dialog.close(returnValue);
      }
    }
    return true; // A request was issued; another cancel listener can still prevent closing.
  }
  function click(event) {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      requestClose();
  }
  dialog.addEventListener("cancel", cancel);
  dialog.addEventListener("click", click);

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
      dialog.removeEventListener("click", click);
      if (originalClosedBy === null) dialog.removeAttribute("closedby");
      else dialog.setAttribute("closedby", originalClosedBy);
    },
  };
}
