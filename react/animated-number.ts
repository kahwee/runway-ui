"use client";

import { createElement, useEffect, useRef, useState } from "react";
import { cx } from "./classes.ts";
import { reducedMotion } from "./reduced-motion.ts";

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
