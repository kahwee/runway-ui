import { createElement, type CSSProperties, type ComponentProps, type ReactNode } from "react";
import { cx } from "./classes.ts";

export type Tone = "warning" | "danger" | "energy" | "morale" | "design" | "pm";

export type PanelProps = Omit<ComponentProps<"section">, "title"> & {
  title?: ReactNode;
  kicker?: ReactNode;
  actions?: ReactNode;
};

/** Surface with an optional kicker, title and header actions. */
export function Panel({ title, kicker, actions, className, children, ...props }: PanelProps) {
  const heading =
    title || kicker || actions
      ? createElement(
          "header",
          { className: "rw-panel__header" },
          createElement(
            "div",
            null,
            kicker && createElement("span", { className: "rw-kicker" }, kicker),
            title && createElement("h2", { className: "rw-panel__title" }, title),
          ),
          actions,
        )
      : null;
  return createElement(
    "section",
    { ...props, className: cx("rw-panel", className) },
    heading,
    children,
  );
}

export type BadgeProps = ComponentProps<"span"> & { tone?: "warning" | "danger" };

/** Small sticker for status. */
export function Badge({ tone, className, ...props }: BadgeProps) {
  return createElement("span", {
    ...props,
    className: cx("rw-badge", className),
    "data-tone": tone,
  });
}

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
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return createElement(
    "div",
    {
      className: cx("rw-meter", className),
      "data-tone": tone,
      role: "meter",
      "aria-label": label,
      "aria-valuemin": 0,
      "aria-valuemax": max,
      "aria-valuenow": value,
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

export type ResourceProps = { icon?: ReactNode; label: string; value: ReactNode };

/** Number in the resource bar, such as cash or energy. */
export function Resource({ icon, label, value }: ResourceProps) {
  return createElement(
    "div",
    { className: "rw-resource" },
    icon && createElement("span", { className: "rw-resource__icon", "aria-hidden": true }, icon),
    createElement(
      "div",
      null,
      createElement("strong", null, value),
      createElement("small", null, label),
    ),
  );
}
