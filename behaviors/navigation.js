/** Roving focus for a flat set of native buttons. This is not a tab-panel widget. */
export function bindNavigation(root, { selector = 'button', columns = 1, wrap = true } = {}) {
  const original = new Map();
  let active;
  const items = () => [...root.querySelectorAll(selector)].filter(el => !el.disabled && el.getAttribute('aria-disabled') !== 'true' && !el.hidden && el.getClientRects().length);
  function refresh() {
    const list = items();
    active = list.includes(active) ? active : list.find(el => el.getAttribute('aria-pressed') === 'true') ?? list[0];
    for (const el of list) { if (!original.has(el)) original.set(el, el.getAttribute('tabindex')); el.tabIndex = el === active ? 0 : -1; }
    return list;
  }
  function move(direction) {
    const list = refresh(); if (!list.length) return;
    const count = typeof columns === 'function' ? columns() : columns;
    const delta = {left:-1,right:1,up:-Math.max(1,count),down:Math.max(1,count)}[direction];
    let next = direction === 'first' ? 0 : direction === 'last' ? list.length - 1 : list.indexOf(active) + (delta ?? 0);
    next = wrap ? (next % list.length + list.length) % list.length : Math.max(0,Math.min(list.length-1,next));
    active.tabIndex = -1; active = list[next]; active.tabIndex = 0; active.focus();
  }
  function keydown(event) {
    if (!items().includes(event.target) || event.altKey || event.ctrlKey || event.metaKey) return;
    const action = {ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down',Home:'first',End:'last'}[event.key];
    if (action) { event.preventDefault(); move(action); }
  }
  function focusin(event) { if (items().includes(event.target)) { active = event.target; refresh(); } }
  root.addEventListener('keydown',keydown); root.addEventListener('focusin',focusin); refresh();
  return { move, refresh, activate() { refresh(); active?.click(); }, destroy() {
    root.removeEventListener('keydown',keydown); root.removeEventListener('focusin',focusin);
    for (const [el,value] of original) { if (value === null) el.removeAttribute('tabindex'); else el.setAttribute('tabindex',value); }
  }};
}

/** Opt-in standard-mapped controller polling. Only the focused root receives input. */
export function bindGamepad(root, navigation) {
  let frame = 0, last = '', nextRepeat = 0;
  function tick(time) {
    if (document.hasFocus() && !document.hidden && root.contains(document.activeElement) && !document.querySelector('dialog:modal')) {
      const pad = [...(navigator.getGamepads?.() ?? [])].find(p => p?.connected && p.mapping === 'standard');
      const action = !pad ? '' : pad.buttons[0]?.pressed ? 'activate' : pad.buttons[12]?.pressed || pad.axes[1] < -.55 ? 'up' : pad.buttons[13]?.pressed || pad.axes[1] > .55 ? 'down' : pad.buttons[14]?.pressed || pad.axes[0] < -.55 ? 'left' : pad.buttons[15]?.pressed || pad.axes[0] > .55 ? 'right' : '';
      if (action && (action !== last || (action !== 'activate' && time >= nextRepeat))) {
        if (action === 'activate') navigation.activate(); else navigation.move(action);
        nextRepeat = time + (action === last ? 120 : 360);
      }
      last = action;
    } else last = '';
    frame = requestAnimationFrame(tick);
  }
  frame = requestAnimationFrame(tick);
  return { destroy() { cancelAnimationFrame(frame); } };
}
