"use client";

import { useEffect, type RefObject } from "react";
import { ownsInput } from "./input-navigation.ts";

export type GamepadCommand = "left" | "right" | "up" | "down" | "activate" | "back";
const directions = new Set<GamepadCommand>(["left", "right", "up", "down"]);

/** Standard mapping only; unknown hardware never guesses activation buttons. */
export function gamepadCommands(
  pad: Pick<Gamepad, "mapping" | "buttons" | "axes">,
): Set<GamepadCommand> {
  const commands = new Set<GamepadCommand>();
  if (pad.mapping !== "standard") return commands;
  const horizontal = pad.buttons[14]?.pressed
    ? "left"
    : pad.buttons[15]?.pressed
      ? "right"
      : (pad.axes[0] ?? 0) < -0.6
        ? "left"
        : (pad.axes[0] ?? 0) > 0.6
          ? "right"
          : undefined;
  const vertical = pad.buttons[12]?.pressed
    ? "up"
    : pad.buttons[13]?.pressed
      ? "down"
      : (pad.axes[1] ?? 0) < -0.6
        ? "up"
        : (pad.axes[1] ?? 0) > 0.6
          ? "down"
          : undefined;
  if (horizontal) commands.add(horizontal);
  if (vertical) commands.add(vertical);
  if (pad.buttons[0]?.pressed) commands.add("activate");
  if (pad.buttons[1]?.pressed) commands.add("back");
  return commands;
}

/** Edge-trigger activation and paced directional repeat, independent of frame rate. */
export function createGamepadRepeater() {
  let initialized = false;
  let held = new Map<GamepadCommand, number>();
  return (commands: Set<GamepadCommand>, now: number): GamepadCommand[] => {
    const actions: GamepadCommand[] = [];
    const next = new Map<GamepadCommand, number>();
    for (const command of commands) {
      const deadline = held.get(command);
      if (initialized && deadline === undefined) actions.push(command);
      else if (initialized && directions.has(command) && now >= deadline!) actions.push(command);
      next.set(
        command,
        deadline === undefined
          ? now + 350
          : now >= deadline && directions.has(command)
            ? now + 120
            : deadline,
      );
    }
    held = next;
    initialized = true;
    return actions;
  };
}

export function useGamepadInput(
  root: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  onCommand: RefObject<(command: GamepadCommand) => void>,
) {
  useEffect(() => {
    const element = root.current;
    const document = element?.ownerDocument;
    const view = document?.defaultView;
    if (
      !enabled ||
      !element ||
      !document ||
      !view ||
      typeof view.navigator.getGamepads !== "function"
    )
      return;
    let frame = 0;
    let alive = true;
    let padIdentity = "";
    let repeat = createGamepadRepeater();
    const active = () =>
      document.visibilityState !== "hidden" &&
      document.hasFocus() &&
      ownsInput(element, document.activeElement);
    const stop = () => {
      view.cancelAnimationFrame(frame);
      frame = 0;
      repeat = createGamepadRepeater();
      padIdentity = "";
    };
    const tick = (now: number) => {
      frame = 0;
      if (!alive) return;
      if (!active()) {
        stop();
        return;
      }
      let pad: Gamepad | undefined;
      try {
        pad = [...view.navigator.getGamepads()].find(
          (pad): pad is Gamepad => !!pad?.connected && pad.mapping === "standard",
        );
      } catch {
        stop();
        return;
      } // Policy-restricted contexts keep keyboard and pointer input.
      if (!pad) {
        stop();
        return;
      }
      const identity = `${pad.index}:${pad.id}`;
      if (identity !== padIdentity) {
        repeat = createGamepadRepeater();
        padIdentity = identity;
      }
      for (const command of repeat(gamepadCommands(pad), now)) onCommand.current(command);
      if (alive && active() && !frame) frame = view.requestAnimationFrame(tick);
    };
    const sync = () => {
      if (!alive) return;
      if (!active()) stop();
      else if (!frame) frame = view.requestAnimationFrame(tick);
    };
    const afterFocus = () => queueMicrotask(sync);
    element.addEventListener("focusin", sync);
    element.addEventListener("focusout", afterFocus);
    document.addEventListener("visibilitychange", sync);
    view.addEventListener("gamepadconnected", sync);
    view.addEventListener("focus", sync);
    view.addEventListener("blur", stop);
    sync();
    return () => {
      alive = false;
      stop();
      element.removeEventListener("focusin", sync);
      element.removeEventListener("focusout", afterFocus);
      document.removeEventListener("visibilitychange", sync);
      view.removeEventListener("gamepadconnected", sync);
      view.removeEventListener("focus", sync);
      view.removeEventListener("blur", stop);
    };
  }, [root, enabled, onCommand]);
}
