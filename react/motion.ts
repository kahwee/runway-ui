import {
  createElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cx } from "./classes.ts";

const reducedMotion = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export type AnimatedNumberProps = {
  value: number;
  /** Formats the in-between and final values. Defaults to a rounded en-US integer. */
  format?: (value: number) => string;
  /** Tween length in milliseconds. */
  duration?: number;
  className?: string;
};

/** Counts toward `value` and bumps when it changes. Jumps straight there under reduced motion. */
export function AnimatedNumber({
  value,
  format = (n) => Math.round(n).toLocaleString("en-US"),
  duration = 700,
  className,
}: AnimatedNumberProps) {
  const [shown, setShown] = useState(value);
  const [trend, setTrend] = useState<"up" | "down">();
  const current = useRef(value);
  useEffect(() => {
    const start = current.current;
    if (start === value) return;
    setTrend(value > start ? "up" : "down");
    const clear = setTimeout(() => setTrend(undefined), duration + 250);
    if (reducedMotion()) {
      current.current = value;
      setShown(value);
      return () => clearTimeout(clear);
    }
    const t0 = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - t0) / duration);
      const eased = 1 - (1 - progress) ** 3;
      current.current = progress < 1 ? start + (value - start) * eased : value;
      setShown(current.current);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(clear);
    };
  }, [value, duration]);
  return createElement(
    "span",
    { className: cx("rw-number", className), "data-trend": trend },
    format(shown),
  );
}

export type ConfettiProps = {
  active: boolean;
  /** Called once the burst has finished, so the host can reset `active`. */
  onDone?: () => void;
  count?: number;
};

/** A short celebratory burst from the middle of the viewport. Renders nothing under reduced motion. */
export function Confetti({ active, onDone, count = 22 }: ConfettiProps) {
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => done.current?.(), reducedMotion() ? 0 : 1500);
    return () => clearTimeout(timer);
  }, [active]);
  if (!active || reducedMotion()) return null;
  // Golden-angle spread keeps the burst even without randomness, so renders stay pure.
  const pieces = Array.from({ length: count }, (_, i) => {
    const angle = i * 2.399963;
    const reach = 0.55 + ((i * 0.618) % 1) * 0.45;
    return {
      "--x": `${Math.round(Math.cos(angle) * reach * 220)}px`,
      "--y": `${-Math.round(90 + ((i * 0.37) % 1) * 150)}px`,
      "--r": `${(i * 67) % 540}deg`,
      "--delay": `${(i % 6) * 28}ms`,
    } as CSSProperties;
  });
  return createElement(
    "div",
    { className: "rw-confetti", "aria-hidden": true },
    pieces.map((style, i) => createElement("i", { key: i, style })),
  );
}

export type Toast = { id: number; message: ReactNode; tone?: "success" | "warning" | "danger" };

/** Toast queue with auto-dismiss. Keeps the four newest. */
export function useToasts(duration = 3600) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(1);
  const dismiss = useCallback(
    (id: number) => setToasts((list) => list.filter((t) => t.id !== id)),
    [],
  );
  const push = useCallback(
    (message: ReactNode, tone?: Toast["tone"]) => {
      const id = next.current++;
      setToasts((list) => [...list.slice(-3), { id, message, tone }]);
      setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss, duration],
  );
  return { toasts, push, dismiss };
}

/** Bottom-corner stack of toasts. Announced politely to assistive technology. */
export function Toaster({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return createElement(
    "div",
    { className: "rw-toasts", role: "status", "aria-live": "polite" },
    toasts.map((toast) =>
      createElement(
        "div",
        { key: toast.id, className: "rw-toast", "data-tone": toast.tone },
        createElement("span", null, toast.message),
        createElement(
          "button",
          { type: "button", "aria-label": "Dismiss", onClick: () => onDismiss(toast.id) },
          "×",
        ),
      ),
    ),
  );
}
