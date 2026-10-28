"use client";

import { createElement, useEffect, useRef, type CSSProperties } from "react";
import { reducedMotion } from "./reduced-motion.ts";

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
