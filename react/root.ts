import { createElement, type ComponentProps } from "react";
import { cx } from "./classes.ts";

export type RunwayProps = ComponentProps<"div"> & {
  theme?: "cozy" | "ledger" | "orbital" | "parchment" | "whimsy" | "midnight";
  density?: "compact";
};

/** Theme root. Every Runway surface renders inside one `rw-ui` element. */
export function Runway({ theme = "cozy", density, className, ...props }: RunwayProps) {
  return createElement("div", {
    ...props,
    className: cx("rw-ui", className),
    "data-theme": theme,
    "data-density": density,
  });
}
