export function percentile(values: readonly number[], fraction: number): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.max(0, Math.min(sorted.length - 1, Math.ceil(fraction * sorted.length) - 1))];
}
export type BenchmarkMetrics = {
  elapsedMs: number;
  ticks: number;
  frames: number;
  frameP95Ms: number;
  frameMedianMs: number;
  slowFrames: number;
  longTasksSupported: boolean;
  longTaskCount: number;
  longTaskTotalMs: number;
  updateP95Ms: number;
  inputP95Ms: number | null;
  inputSamples: number;
  visibilityLost: boolean;
};

/** Story-only measurement. It never enters the distributed component runtime. */
export function measureBusyScreen() {
  const started = performance.now();
  const frames: number[] = [],
    updates: number[] = [],
    inputs: number[] = [],
    tasks: number[] = [];
  let previous = 0,
    frame = 0,
    visibilityLost = document.visibilityState !== "visible";
  const visibility = () => {
    if (document.visibilityState !== "visible") visibilityLost = true;
  };
  document.addEventListener("visibilitychange", visibility);
  const longTasksSupported =
    typeof PerformanceObserver !== "undefined" &&
    PerformanceObserver.supportedEntryTypes.includes("longtask");
  const observer = longTasksSupported
    ? new PerformanceObserver((list) =>
        tasks.push(...list.getEntries().map((entry) => entry.duration)),
      )
    : undefined;
  observer?.observe({ entryTypes: ["longtask"] });
  const tick = (now: number) => {
    if (previous) frames.push(now - previous);
    previous = now;
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  const cleanup = () => {
    cancelAnimationFrame(frame);
    document.removeEventListener("visibilitychange", visibility);
    if (observer) {
      tasks.push(...observer.takeRecords().map((entry) => entry.duration));
      observer.disconnect();
    }
  };
  return {
    update: (start: number) => updates.push(performance.now() - start),
    input: (start: number) => inputs.push(performance.now() - start),
    cancel: cleanup,
    finish(): BenchmarkMetrics {
      cleanup();
      return {
        elapsedMs: performance.now() - started,
        ticks: updates.length,
        frames: frames.length,
        frameP95Ms: percentile(frames, 0.95),
        frameMedianMs: percentile(frames, 0.5),
        slowFrames: frames.filter((ms) => ms > 32).length,
        longTasksSupported,
        longTaskCount: tasks.length,
        longTaskTotalMs: tasks.reduce((sum, value) => sum + value, 0),
        updateP95Ms: percentile(updates, 0.95),
        inputP95Ms: inputs.length ? percentile(inputs, 0.95) : null,
        inputSamples: inputs.length,
        visibilityLost,
      };
    },
  };
}
