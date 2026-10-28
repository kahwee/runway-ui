import assert from "node:assert/strict";
import test from "node:test";
import { percentile } from "../stories/performance/metrics.ts";

test("benchmark percentiles use nearest rank, preserve samples and handle empty runs", () => {
  const samples = [20, 1, 7, 3, 9];
  assert.equal(percentile(samples, 0.5), 7);
  assert.equal(percentile(samples, 0.95), 20);
  assert.equal(percentile([], 0.95), 0);
  assert.equal(percentile([16.7], 0.95), 16.7);
  assert.deepEqual(samples, [20, 1, 7, 3, 9]);
});
