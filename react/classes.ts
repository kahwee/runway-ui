/** Join class names, skipping empty values. */
export function cx(...names: (string | false | null | undefined)[]): string {
  return names.filter(Boolean).join(" ");
}

/** Preserve Base UI's state-dependent classes and consumer refs/props. */
export function stateClasses<State>(
  base: string,
  custom: string | ((state: State) => string | undefined) | undefined,
) {
  return typeof custom === "function"
    ? (state: State) => `${base} ${custom(state) ?? ""}`.trim()
    : `${base} ${custom ?? ""}`.trim();
}
