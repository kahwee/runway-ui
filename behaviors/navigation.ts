export type Direction = "left" | "right" | "up" | "down" | "first" | "last";

export type Navigation = {
  move(direction: Direction): void;
  activate(): void;
  refresh(): HTMLElement[];
  destroy(): void;
};

const directions = new Set(["left", "right", "up", "down", "first", "last"]);

/** Roving focus for native controls. Selection and ARIA widget semantics belong to the host. */

export function bindNavigation(
  root: HTMLElement,
  {
    selector = "button",
    columns = 1,
    wrap = true,
  }: {
    selector?: string;
    columns?: number | (() => number);
    wrap?: boolean;
  } = {},
): Navigation {
  const window = root.ownerDocument.defaultView;
  if (!window) throw new TypeError("Navigation requires a document with a window");
  const view = window;

  const original: Map<HTMLElement, string | null> = new Map();

  let active: HTMLElement | undefined;
  let destroyed = false;
  function columnCount() {
    const count = typeof columns === "function" ? columns() : columns;
    if (!Number.isInteger(count) || count < 1)
      throw new RangeError("columns must resolve to a positive integer");
    return count;
  }
  columnCount();
  root.querySelectorAll(selector); // Validate the selector before installing listeners.

  function eligible(element: HTMLElement) {
    const visibility = view.getComputedStyle(element).visibility;
    return (
      !element.matches(":disabled") &&
      element.getAttribute("aria-disabled") !== "true" &&
      !element.closest("[inert]") &&
      !element.hidden &&
      element.getClientRects().length > 0 &&
      visibility !== "hidden" &&
      visibility !== "collapse"
    );
  }

  function restore(element: HTMLElement, value: string | null) {
    if (value === null) element.removeAttribute("tabindex");
    else element.setAttribute("tabindex", value);
  }
  function refresh() {
    if (destroyed) return [];
    const candidates = [...(root.querySelectorAll(selector) as NodeListOf<HTMLElement>)];
    for (const [element, value] of original) {
      if (!candidates.includes(element)) {
        restore(element, value);
        original.delete(element);
      }
    }
    for (const element of candidates) {
      if (!original.has(element)) original.set(element, element.getAttribute("tabindex"));
    }
    const list = candidates.filter(eligible);
    active =
      active && list.includes(active)
        ? active
        : (list.find((element) => element.getAttribute("aria-pressed") === "true") ?? list[0]);
    for (const element of candidates) element.tabIndex = element === active ? 0 : -1;
    return list;
  }

  function move(direction: Direction) {
    if (!directions.has(direction)) return;
    const list = refresh();
    if (!list.length) return;
    const count = columnCount();
    const delta = { left: -1, right: 1, up: -count, down: count, first: 0, last: 0 }[direction];
    let next =
      direction === "first"
        ? 0
        : direction === "last"
          ? list.length - 1
          : list.indexOf(active as HTMLElement) + delta;
    next = wrap
      ? ((next % list.length) + list.length) % list.length
      : Math.max(0, Math.min(list.length - 1, next));
    if (active) active.tabIndex = -1;
    active = list[next];
    active.tabIndex = 0;
    active.focus();
  }

  function keydown(event: KeyboardEvent) {
    if (!(event.target instanceof Element)) return;
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.target.closest("input,select,textarea,[contenteditable]:not([contenteditable=false])")
    )
      return;
    if (!refresh().some((element) => element === event.target)) return;

    const keys: Partial<Record<string, Direction>> = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down",
      Home: "first",
      End: "last",
    };
    const action = keys[event.key];
    if (action) {
      event.preventDefault();
      move(action);
    }
  }

  function focusin(event: FocusEvent) {
    if (!(event.target instanceof HTMLElement)) return;
    if (
      (root.querySelectorAll(selector) as NodeListOf<HTMLElement>).length &&
      event.target.matches(selector) &&
      eligible(event.target)
    ) {
      active = event.target;
      refresh();
    }
  }
  root.addEventListener("keydown", keydown);
  root.addEventListener("focusin", focusin);
  refresh();
  return {
    move,
    refresh,
    activate() {
      if (refresh().length) active?.click();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      root.removeEventListener("keydown", keydown);
      root.removeEventListener("focusin", focusin);
      for (const [element, value] of original) restore(element, value);
      original.clear();
    },
  };
}

/** Opt-in standard-mapped controller polling, limited to the focused document/root. */

export function bindGamepad(
  root: HTMLElement,
  navigation: Pick<Navigation, "move" | "activate">,
): {
  destroy(): void;
} {
  const document = root.ownerDocument;
  const window = document.defaultView;
  if (!window) throw new TypeError("Gamepad requires a document with a window");
  const view = window;
  let frame = 0,
    last = "",
    nextRepeat = 0,
    destroyed = false;

  function tick(time: number) {
    if (destroyed) return;
    if (
      document.hasFocus() &&
      !document.hidden &&
      root.contains(document.activeElement) &&
      !document.querySelector("dialog:modal")
    ) {
      let pads: (Gamepad | null)[] = [];
      try {
        pads = view.navigator.getGamepads?.() ?? [];
      } catch {
        /* Permission policy can block access. */
      }
      const pad = [...pads].find(
        (candidate) => candidate?.connected && candidate.mapping === "standard",
      );
      const action = !pad
        ? ""
        : pad.buttons[0]?.pressed
          ? "activate"
          : pad.buttons[12]?.pressed || pad.axes[1] < -0.55
            ? "up"
            : pad.buttons[13]?.pressed || pad.axes[1] > 0.55
              ? "down"
              : pad.buttons[14]?.pressed || pad.axes[0] < -0.55
                ? "left"
                : pad.buttons[15]?.pressed || pad.axes[0] > 0.55
                  ? "right"
                  : "";
      if (action && (action !== last || (action !== "activate" && time >= nextRepeat))) {
        if (action === "activate") navigation.activate();
        else navigation.move(action);
        nextRepeat = time + (action === last ? 120 : 360);
      }
      last = action;
    } else last = "";
    frame = view.requestAnimationFrame(tick);
  }
  frame = view.requestAnimationFrame(tick);
  return {
    destroy() {
      destroyed = true;
      view.cancelAnimationFrame(frame);
    },
  };
}
