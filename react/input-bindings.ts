export type InputBinding = {
  id: string;
  label: string;
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  onActivate: () => void;
};

export function matchesBinding(event: KeyboardEvent, binding: InputBinding): boolean {
  return (
    event.key.toLowerCase() !== "tab" &&
    !event.isComposing &&
    !event.repeat &&
    event.key.toLowerCase() === binding.key.toLowerCase() &&
    event.altKey === !!binding.altKey &&
    event.ctrlKey === !!binding.ctrlKey &&
    event.metaKey === !!binding.metaKey &&
    event.shiftKey === !!binding.shiftKey
  );
}

export function bindingKeys(binding: InputBinding): string {
  return [
    binding.ctrlKey && "Ctrl",
    binding.altKey && "Alt",
    binding.shiftKey && "Shift",
    binding.metaKey && "Meta",
    binding.key === " " ? "Space" : binding.key,
  ]
    .filter(Boolean)
    .join("+");
}
