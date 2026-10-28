"use client";

import { createElement, useEffect, useRef, useState, type CSSProperties } from "react";
import { cx } from "./classes.ts";

export type Tone = "warning" | "danger" | "energy" | "morale" | "design" | "pm";

export type MeterProps = {
  label: string;
  /** Current value from 0 to `max`. */
  value: number;
  max?: number;
  tone?: Tone;
  className?: string;
};

/** Labelled progress capsule with an accessible `meter` role. */
export function Meter({ label, value, max = 100, tone, className }: MeterProps) {
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const current = Number.isFinite(value) ? Math.min(limit, Math.max(0, value)) : 0;
  const percent = (current / limit) * 100;
  const previous = useRef(percent);
  const [change, setChange] = useState<"up" | "down">();
  useEffect(() => {
    if (previous.current === percent) return;
    setChange(percent > previous.current ? "up" : "down");
    previous.current = percent;
    const timer = setTimeout(() => setChange(undefined), 700);
    return () => clearTimeout(timer);
  }, [percent]);
  return createElement(
    "div",
    {
      className: cx("rw-meter", className),
      "data-change": change,
      "data-tone": tone,
      "data-low": percent <= 25 ? "" : undefined,
      role: "meter",
      "aria-label": label,
      "aria-valuemin": 0,
      "aria-valuemax": limit,
      "aria-valuenow": current,
    },
    createElement(
      "div",
      { className: "rw-meter__label", "aria-hidden": true },
      createElement("span", null, label),
      createElement("span", null, `${Math.round(percent)}%`),
    ),
    createElement(
      "div",
      { className: "rw-meter__track" },
      createElement("div", {
        className: "rw-meter__fill",
        style: { "--rw-value": `${percent}%` } as CSSProperties,
      }),
    ),
  );
}
