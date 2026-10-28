"use client";

import { Input as BaseInput } from "@base-ui/react/input";
import { createElement, type ComponentProps } from "react";
import { stateClasses } from "./classes.ts";

/** Runway styling with Base UI Field association and validation. */
export function Input({ className, ...props }: ComponentProps<typeof BaseInput>) {
  return createElement(BaseInput, { ...props, className: stateClasses("rw-input", className) });
}
