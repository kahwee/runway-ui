"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import { Input as BaseInput } from "@base-ui/react/input";
import { createElement } from "react";

export { Checkbox } from "@base-ui/react/checkbox";
export { Field } from "@base-ui/react/field";
export { Select } from "@base-ui/react/select";

/**
 * Preserve Base UI's state-dependent classes and consumer refs/props.
 * @template State
 * @param {string} base
 * @param {string | ((state: State) => string | undefined) | undefined} custom
 */
function classes(base, custom) {
  return typeof custom === "function"
    ? /** @param {State} state */ (state) => `${base} ${custom(state) ?? ""}`.trim()
    : `${base} ${custom ?? ""}`.trim();
}

/** Runway styling with Base UI button semantics, including render/ref composition.
 * @param {import('react').ComponentProps<typeof BaseButton>} props
 */
export function Button({ className, ...props }) {
  return createElement(BaseButton, { ...props, className: classes("rw-button", className) });
}

/** Runway styling with Base UI Field association and validation.
 * @param {import('react').ComponentProps<typeof BaseInput>} props
 */
export function Input({ className, ...props }) {
  return createElement(BaseInput, { ...props, className: classes("rw-input", className) });
}
