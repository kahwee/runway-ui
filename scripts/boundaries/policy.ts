/** Dependency direction, independent of parsing and filesystem traversal. */
export const vanillaRuntime = (file: string) =>
  file === "index.css" || /^(behaviors|styles)\//.test(file);
export const foundationStyle = (file: string) =>
  /^styles\/(?:tokens|primitives|controls|panels|native|fields|forms)(?:\.css|\/)/.test(file);
export const allowedReactPeer = (value: string) =>
  value === "react" ||
  value.startsWith("react/") ||
  value.startsWith("@base-ui/react/") ||
  value === "@tanstack/charts" ||
  value.startsWith("@tanstack/charts/");

export const cssAggregate = (file: string) =>
  /^styles\/(?:patterns|fields|forms|social|cozy|workspace|studio|observatory|charts|instruments|feedback)\.css$/.test(
    file,
  );
