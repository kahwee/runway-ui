import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { RecordedHistory, recordedRuns } from "../stories/react/recorded-history.tsx";

test("missing and nonfinite observations break lines without discarding zero or negative values", () => {
  const points = Object.freeze([
    Object.freeze({ day: 1, value: -4 }),
    Object.freeze({ day: 2, value: 0 }),
    Object.freeze({ day: 3, value: null }),
    Object.freeze({ day: 4, value: 8 }),
    Object.freeze({ day: 5, value: Number.NaN }),
    Object.freeze({ day: 6, value: 2 }),
  ]);
  expect(recordedRuns(points)).toEqual([
    [
      { day: 1, value: -4 },
      { day: 2, value: 0 },
    ],
    [{ day: 4, value: 8 }],
    [{ day: 6, value: 2 }],
  ]);
  expect(points[2].value).toBeNull();
});

test("empty history keeps an exact-data fallback without fabricating a chart", () => {
  const html = renderToStaticMarkup(
    createElement(RecordedHistory, { preset: "empty", width: 240 }),
  );
  expect(html).toContain("No observations recorded.");
  expect(html).toContain("Exact recorded observations");
  expect(html).not.toContain("<svg");
});

test("recorded zero and missing values remain distinct in the exact table", () => {
  const html = renderToStaticMarkup(createElement(RecordedHistory, { preset: "gaps", width: 240 }));
  expect(html).toContain('scope="row">Day 3</th><td>Not recorded</td>');
  expect(html).toContain('scope="row">Day 4</th><td>0</td>');
});
