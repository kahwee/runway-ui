export type Direction = "left" | "right" | "up" | "down" | "first" | "last";
export interface Navigation {
  move(direction: Direction): void;
  activate(): void;
  refresh(): HTMLElement[];
  destroy(): void;
}
export declare function bindNavigation(
  root: HTMLElement,
  options?: { selector?: string; columns?: number | (() => number); wrap?: boolean },
): Navigation;
export declare function bindGamepad(
  root: HTMLElement,
  navigation: Pick<Navigation, "move" | "activate">,
): { destroy(): void };
