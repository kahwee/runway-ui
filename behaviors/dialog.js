/** Optional native-dialog behavior. No rendering, game state, focus trap or framework. */
export function bindDialog(dialog, { canDismiss = () => true } = {}) {
  const cancel = event => { if (!canDismiss()) event.preventDefault(); };
  const click = event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) requestClose();
  };
  function requestClose() {
    if (!canDismiss()) return false;
    if (typeof dialog.requestClose === 'function') dialog.requestClose();
    else dialog.close();
    return true;
  }
  dialog.addEventListener('cancel', cancel);
  dialog.addEventListener('click', click);
  return {
    open() { dialog.setAttribute('closedby', canDismiss() ? 'closerequest' : 'none'); if (!dialog.open) dialog.showModal(); },
    requestClose,
    destroy() { dialog.removeEventListener('cancel', cancel); dialog.removeEventListener('click', click); }
  };
}
