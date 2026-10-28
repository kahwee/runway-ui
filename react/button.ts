"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import { createElement, type ComponentProps } from "react";
import { stateClasses } from "./classes.ts";

/** Runway styling with Base UI button semantics, including render/ref composition. */
export function Button({ className, ...props }: ComponentProps<typeof BaseButton>) {
  return createElement(BaseButton, { ...props, className: stateClasses("rw-button", className) });
}
