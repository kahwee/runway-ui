"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import { Input as BaseInput } from "@base-ui/react/input";
import { createElement, type ComponentProps } from "react";

export { Checkbox } from "@base-ui/react/checkbox";
export { Field } from "@base-ui/react/field";
export { Select } from "@base-ui/react/select";

/** Preserve Base UI's state-dependent classes and consumer refs/props. */
function classes<State>(
  base: string,
  custom: string | ((state: State) => string | undefined) | undefined,
) {
  return typeof custom === "function"
    ? (state: State) => `${base} ${custom(state) ?? ""}`.trim()
    : `${base} ${custom ?? ""}`.trim();
}

/** Runway styling with Base UI button semantics, including render/ref composition. */
export function Button({ className, ...props }: ComponentProps<typeof BaseButton>) {
  return createElement(BaseButton, { ...props, className: classes("rw-button", className) });
}

/** Runway styling with Base UI Field association and validation. */
export function Input({ className, ...props }: ComponentProps<typeof BaseInput>) {
  return createElement(BaseInput, { ...props, className: classes("rw-input", className) });
}

export { Runway, type RunwayProps } from "./root.ts";
export {
  Badge,
  Meter,
  Panel,
  Resource,
  type BadgeProps,
  type MeterProps,
  type PanelProps,
  type ResourceProps,
  type Tone,
} from "./game.ts";
export {
  CommandBar,
  ControlConsole,
  Dossier,
  DossierList,
  FolioTabs,
  Sheet,
  type CommandStat,
  type DossierProps,
  type FolioTabsProps,
} from "./desk.ts";
export { Chart, ChartCard, defineChart } from "./chart.ts";
export { cx } from "./classes.ts";
/** Native progress semantics; omit value for indeterminate work. Supply an accessible name. */
export function Progress({ className, ...props }: ComponentProps<"progress">) {
  return createElement("progress", {
    ...props,
    className: `rw-progress ${className ?? ""}`.trim(),
  });
}
