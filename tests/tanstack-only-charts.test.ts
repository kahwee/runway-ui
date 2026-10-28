import { expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ChartPlayground } from "../examples/charts/components.tsx";
import { samplePoints } from "../examples/charts/model.ts";

test("stacked examples preserve original segment amounts instead of normalizing them", () => {
  const points = samplePoints("stacked", "sample");
  expect(points.filter((p) => p.day === 1).map((p) => p.value)).toEqual([24, 18]);
  const html = renderToStaticMarkup(
    createElement(ChartPlayground, { kind: "stacked", preset: "sample", width: 320, height: 200 }),
  );
  expect(html).toContain("Scheduled");
  expect(html).toContain("Available");
  expect(html).toContain("<td>24</td>");
  expect(html).toContain("<td>18</td>");
});

test("missing categories retain their identity and real zeros remain data", () => {
  const missing = samplePoints("line", "missing");
  expect(missing.map((p) => p.day)).toEqual([1, 2, 3, 4, 5, 6]);
  expect(missing[2].value).toBeNull();
  expect(samplePoints("columns", "zero").map((p) => p.value)).toEqual([0, 0, 0, 0, 0, 0]);
  expect(samplePoints("diverging", "sample")[1].value).toBe(-38);
});

test("published stylesheet sources cannot reintroduce the retired CSS plot engine", async () => {
  const oldMarks =
    /\.(?:rw-column-(?:track|mark)|rw-stack-(?:track|mark)|rw-diverging-(?:track|mark)|rw-area|rw-spark|rw-chart__plot)(?:[\s:{.[>]|$)/;
  for await (const file of new Bun.Glob("**/*.css").scan("styles")) {
    expect(await Bun.file(`styles/${file}`).text()).not.toMatch(oldMarks);
  }
});
