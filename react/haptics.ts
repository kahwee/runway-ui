export type HapticPattern = "tap" | "success" | "warning" | number | number[];

const patterns = { tap: 8, success: [10, 40, 14], warning: [30, 50, 30] };

/**
 * Short vibration for touch devices. Returns false where the Vibration API is unavailable
 * (desktop browsers, iOS Safari), so it is always safe to call.
 */
export function haptic(pattern: HapticPattern = "tap"): boolean {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return false;
  return navigator.vibrate(typeof pattern === "string" ? patterns[pattern] : pattern);
}
