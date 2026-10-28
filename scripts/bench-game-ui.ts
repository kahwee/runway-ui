// Serve a production Storybook build, then run: bun run bench-game-ui http://127.0.0.1:6031/
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { percentile, type BenchmarkMetrics } from "../stories/performance/metrics.ts";

const args = process.argv.slice(2);
const origin = new URL(args[0] && !args[0].startsWith("--") ? args[0] : "http://127.0.0.1:6031/");
const option = (name: string) => {
  const index = args.indexOf(name);
  return index < 0 ? undefined : args[index + 1];
};
const output = resolve(option("--output") ?? ".local/benchmarks/game-ui.json");
const session = `runway-benchmark-${process.pid}`;
const scenarios = [
  { name: "reference", resources: 30, slots: 120, charts: 1, duration: 5000, rate: 10 },
  { name: "busy", resources: 300, slots: 1000, charts: 4, duration: 5000, rate: 10 },
];
async function browser(...args: string[]) {
  const child = Bun.spawn(["agent-browser", "--session", session, "--json", ...args], {
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  assert.equal(code, 0, JSON.stringify({ args, stdout, stderr }));
  const response = JSON.parse(stdout);
  assert.equal(response.success, true, JSON.stringify(response));
  return response.data;
}
const revision = Bun.spawnSync(["git", "rev-parse", "HEAD"], { stdout: "pipe" });
const dirty = Bun.spawnSync(["git", "status", "--porcelain", "--", ".", ":!node_modules"], {
  stdout: "pipe",
});
const report = {
  revision: new TextDecoder().decode(revision.stdout).trim(),
  dirty: !!new TextDecoder().decode(dirty.stdout).trim(),
  timestamp: new Date().toISOString(),
  viewport: { width: 1440, height: 900 },
  environment: null as unknown,
  runs: [] as {
    scenario: (typeof scenarios)[number];
    warmup: boolean;
    metrics: BenchmarkMetrics;
  }[],
  summary: {} as Record<string, Record<string, number>>,
};
try {
  await browser("set", "viewport", "1440", "900");
  for (const scenario of scenarios) {
    const measured: BenchmarkMetrics[] = [];
    for (let run = 0; run < 4; run++) {
      const url = new URL("iframe.html", origin);
      url.searchParams.set("id", "performance-busy-screen--benchmark");
      url.searchParams.set("viewMode", "story");
      url.searchParams.set(
        "args",
        Object.entries(scenario)
          .filter(([name]) => name !== "name")
          .map(([name, value]) => `${name}:${value}`)
          .join(";"),
      );
      await browser("open", url.href);
      await browser("tab", "t1");
      await browser("wait", "[data-benchmark-start]");
      await browser("snapshot", "-i");
      const actual = (
        await browser(
          "eval",
          "({resources:document.querySelectorAll('.rw-resource').length,slots:document.querySelectorAll('.rw-slot').length,charts:document.querySelectorAll('.busy-screen__charts .rw-figure').length})",
        )
      ).result;
      assert.deepEqual(
        actual,
        { resources: scenario.resources, slots: scenario.slots, charts: scenario.charts },
        "Rendered workload differs from requested scenario",
      );
      await browser("eval", "document.fonts.ready");
      report.environment = (
        await browser(
          "eval",
          "({browser:navigator.userAgent,logicalProcessors:navigator.hardwareConcurrency,devicePixelRatio,visibility:document.visibilityState,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches})",
        )
      ).result;
      await browser("wait", "500");
      const probe = (
        await browser(
          "eval",
          "(()=>{const r=document.querySelector('[data-benchmark-probe]').getBoundingClientRect();return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2)};})()",
        )
      ).result;
      await browser("click", "[data-benchmark-start]");
      await browser(
        "wait",
        "--fn",
        "document.querySelector('[data-benchmark-state]')?.dataset.benchmarkState === 'running'",
      );
      for (let sample = 0; sample < 3; sample++) {
        await browser("wait", "500");
        await browser("mouse", "move", String(probe.x), String(probe.y));
        await browser("mouse", "down");
        await browser("mouse", "up");
      }
      await browser("wait", "--fn", "!!document.querySelector('[data-benchmark-results]')");
      const metrics = (
        await browser(
          "eval",
          "JSON.parse(document.querySelector('[data-benchmark-results]').textContent)",
        )
      ).result as BenchmarkMetrics;
      report.runs.push({ scenario, warmup: run === 0, metrics });
      assert.equal(metrics.visibilityLost, false, "Backgrounded runs are invalid");
      assert.ok(metrics.frames > 0 && metrics.ticks > 0, "Workload did not run");
      assert.ok(metrics.inputSamples >= 3, `Missing input probes: ${JSON.stringify(metrics)}`);
      assert.deepEqual((await browser("errors")).errors, []);
      if (run > 0) measured.push(metrics);
    }
    const summary: Record<string, number> = {};
    for (const key of [
      "frameP95Ms",
      "updateP95Ms",
      "inputP95Ms",
      "longTaskCount",
      "longTaskTotalMs",
      "ticks",
      "frames",
    ] as const)
      summary[key] = percentile(
        measured.map((metrics) => metrics[key] ?? 0),
        0.5,
      );
    report.summary[scenario.name] = summary;
    console.log(
      `${scenario.name}: median of 3 runs after 1 warmup: frame p95 ${summary.frameP95Ms.toFixed(1)} ms, update p95 ${summary.updateP95Ms.toFixed(1)} ms, input p95 ${summary.inputP95Ms.toFixed(1)} ms; ${measured.every((metrics) => metrics.longTasksSupported) ? `${summary.longTaskCount} long tasks` : "long tasks unavailable"}; ${summary.ticks} committed updates.`,
    );
  }
  const writeBudget = option("--write-budget");
  if (writeBudget) {
    const limits = Object.fromEntries(
      scenarios.map((scenario) => [
        scenario.name,
        Object.fromEntries(
          ["frameP95Ms", "updateP95Ms", "inputP95Ms"].map((key) => [
            key,
            Math.ceil(
              Math.max(
                report.summary[scenario.name][key] * 1.5,
                report.summary[scenario.name][key] + 4,
              ) * 10,
            ) / 10,
          ]),
        ),
      ]),
    );
    await Bun.write(
      resolve(writeBudget),
      JSON.stringify(
        {
          description:
            "Local regression limits: 50% or 4ms headroom above the reference run. Not a universal frame-rate guarantee.",
          viewport: report.viewport,
          environment: report.environment,
          reference: {
            revision: report.revision,
            dirty: report.dirty,
            timestamp: report.timestamp,
          },
          scenarios,
          minimumTicks: Object.fromEntries(
            scenarios.map((scenario) => [
              scenario.name,
              Math.floor(report.summary[scenario.name].ticks * 0.9),
            ]),
          ),
          limits,
        },
        null,
        2,
      ) + "\n",
    );
  }
  const budgetPath = option("--budget");
  if (budgetPath) {
    const budget = await Bun.file(resolve(budgetPath)).json();
    assert.deepEqual(budget.scenarios, scenarios, "Budget workloads differ");
    assert.deepEqual(budget.viewport, report.viewport, "Budget viewport differs");
    for (const [name, minimum] of Object.entries(budget.minimumTicks as Record<string, number>))
      assert.ok(
        report.summary[name].ticks >= minimum,
        `${name}: ${report.summary[name].ticks} updates below minimum ${minimum}`,
      );
    for (const [name, limits] of Object.entries(
      budget.limits as Record<string, Record<string, number>>,
    ))
      for (const [key, limit] of Object.entries(limits))
        assert.ok(
          report.summary[name][key] <= limit,
          `${name} ${key}: ${report.summary[name][key].toFixed(1)}ms exceeds ${limit}ms`,
        );
  }
} finally {
  await Bun.write(output, JSON.stringify(report, null, 2) + "\n");
  await browser("close");
}
console.log(`Saved benchmark evidence to ${output}`);
