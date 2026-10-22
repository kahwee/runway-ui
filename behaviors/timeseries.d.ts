import type { HistoryAnnotation, HistoryOptions } from "./history.js";
export interface HistoryWindowOptions
  extends Omit<HistoryOptions, "values" | "labels" | "annotations"> {
  /** Every observation, in time order; null marks a missing slot. No practical length limit. */
  values: Array<number | null>;
  labels: string[];
  /** Indexes refer to the full series. */
  annotations?: HistoryAnnotation[];
  /** Observations drawn at once, 1–366. Default 30. */
  windowSize?: number;
  /** Sizes offered in the window picker. Default [7, 30, 90]. */
  windowSizes?: number[];
  /** First visible observation. Defaults to the latest window. */
  start?: number;
  /** Bars in the whole-series overview. Default 120. */
  overviewBins?: number;
  onChange?: (window: { start: number; size: number; end: number }) => void;
}
export interface HistoryWindow {
  readonly state: { start: number; size: number; end: number; total: number };
  setWindow(start: number, size?: number): void;
  /** Aborts every listener and empties the root. */
  destroy(): void;
}
/** Draws one window of a long series with an overview, scrubber and pager. */
export declare function mountHistoryWindow(
  root: Element,
  options: HistoryWindowOptions,
): HistoryWindow;
