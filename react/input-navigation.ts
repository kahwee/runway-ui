export type InputDirection = "left" | "right" | "up" | "down" | "first" | "last";

const owned = (root: HTMLElement, element: Element) =>
  element.closest("[data-rw-input-scope]") === root;

/** Native editing and compound widgets keep their own keyboard contracts. */
export function ownsInput(root: HTMLElement, target: Element | null): boolean {
  if (!target || !root.contains(target) || !owned(root, target)) return false;
  if (
    target.closest(
      'input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="combobox"],[role="slider"],[role="spinbutton"],[role="listbox"],[role="menu"],[role="tablist"],[role="tree"],[role="grid"]',
    )
  )
    return false;
  const modal = root.ownerDocument.querySelector("dialog:modal");
  return !modal || modal.contains(root);
}

function focusCandidates(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>("[data-rw-focus-item]")].filter(
    (element) =>
      owned(root, element) &&
      element.tabIndex >= 0 &&
      !element.closest("[hidden],[inert]") &&
      element.getClientRects().length > 0 &&
      root.ownerDocument.defaultView?.getComputedStyle(element).visibility !== "hidden",
  );
}
const enabled = (element: HTMLElement) => !element.matches(':disabled,[aria-disabled="true"]');

export function focusItems(root: HTMLElement): HTMLElement[] {
  return focusCandidates(root).filter(enabled);
}

/** Disabled slots keep their positions in an explicit column layout. */
export function nextFocusIndex(
  available: readonly boolean[],
  current: number,
  direction: InputDirection,
  columns: number,
  loop: boolean,
): number {
  const first = available.indexOf(true);
  if (first < 0) return -1;
  if (direction === "first" || current < 0) return first;
  if (direction === "last") return available.lastIndexOf(true);
  const count = Number.isFinite(columns) ? Math.max(1, Math.floor(columns)) : 1;
  const delta = { left: -1, right: 1, up: -count, down: count }[direction];
  let next = current;
  for (let tried = 0; tried < available.length; tried++) {
    next += delta;
    if (loop) next = ((next % available.length) + available.length) % available.length;
    else if (next < 0 || next >= available.length) break;
    if (available[next]) return next;
  }
  return available[current] ? current : first;
}

export function moveInputFocus(
  root: HTMLElement,
  direction: InputDirection,
  columns: number,
  loop: boolean,
): boolean {
  const items = focusCandidates(root);
  const current = items.findIndex((item) => item === root.ownerDocument.activeElement);
  const rtl = root.ownerDocument.defaultView?.getComputedStyle(root).direction === "rtl";
  const physical =
    rtl && direction === "left" ? "right" : rtl && direction === "right" ? "left" : direction;
  const next = nextFocusIndex(items.map(enabled), current, physical, columns, loop);
  if (next < 0) return false;
  items[next].focus();
  return true;
}
