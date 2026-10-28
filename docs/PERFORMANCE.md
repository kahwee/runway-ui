# Busy-screen performance

The benchmark measures steady-state updates using real `Resource` / `AnimatedNumber`,
`Inventory` and TanStack `Chart` components. It is a development fixture, not a
simulation engine, page-load score or promise of a particular frame rate.

## Workloads and method

| Workload | Updating resources | Mounted inventory slots | Charts | Samples per chart |
| --- | ---: | ---: | ---: | ---: |
| Reference | 30 | 120 | 1 | 120 |
| Busy | 300 | 1,000 | 4 | 120 |

Both request 10 data updates per second for five seconds. Each scenario gets one
excluded warmup run and three measured runs in a production Storybook build.
The runner verifies rendered component counts against the requested arguments.
Readouts and inventory use labelled scroll regions; charts remain visible in the
1440 × 900 layout. Every inventory slot is mounted deliberately: this is not
virtualization, and it is not guidance to render thousands of interactive cells
without an application-specific access strategy.

Metrics are the median of the three per-run results:

- **Frame p95:** nearest-rank p95 of requestAnimationFrame intervals. This includes
  rendering/scheduling stalls, not just React work. Initial mounting is excluded.
- **Update p95:** time from a scheduled data update to the corresponding React
  layout effect after commit. It excludes the subsequent paint.
- **Input p95:** native pointer event timestamp to React layout effect after the
  input receipt commits. Three probes use pointer coordinates captured before the
  run, avoiding repeated element lookup in the timed workload. It is not a full
  INP measurement.
- **Long tasks:** browser PerformanceObserver entries, where supported. Unsupported
  observations are marked unavailable, not treated as proof of zero long tasks.
- **Completed updates:** committed data updates during the sample window. Keep this
  alongside latency so reduced throughput cannot masquerade as an improvement.

The tab is explicitly activated. Backgrounded runs fail and retain their raw data
for diagnosis. Browser actions, caches, machine load and rendering capabilities
still affect timing; this is a repeatable local comparison, not a cross-device
benchmark. Avoid running builds or unrelated profiling alongside it.

## Initial local reference

Observed on 2026-10-28 UTC in Headless Chrome 156, 1440 × 900, device scale 1,
eight reported logical processors and normal motion preferences. The initial
reference was measured on a local candidate based on `aa2023e`; its raw metadata
records uncommitted changes. These are observed workload results, not release
performance claims.

| Workload | Frame p95 | Update p95 | Input p95 | Completed updates | Median long tasks |
| --- | ---: | ---: | ---: | ---: | ---: |
| Reference | 16.7 ms | 2.3 ms | 1.6 ms | 49 | 0 |
| Busy | 33.4 ms | 22.9 ms | 20.2 ms | 49 | 0 |

The busy workload has a higher frame/update cost, even with low input-to-commit
latency. These results do not establish 60 fps under that load. Initial rendering,
heap growth, low-end hardware, other engines and physical controllers are separate
validation work.

## Regression limits

[The reference budget](game-ui-budget.json) allows the larger of 50% or 4ms
headroom above each reference timing, and requires at least 90% of the observed
completed updates (rounded down). It records the workload, viewport and reference
environment. These are local regression limits, not universal product targets or
CI timing requirements for arbitrary hardware.

| Workload | Frame p95 maximum | Update p95 maximum | Input p95 maximum | Minimum completed updates |
| --- | ---: | ---: | ---: | ---: |
| Reference | 25.1 ms | 6.3 ms | 5.6 ms | 44 |
| Busy | 50.2 ms | 34.4 ms | 30.4 ms | 44 |

```sh
bun run build
bun run build-storybook
python3 -m http.server 6031 --bind 127.0.0.1
# In another terminal, using an installed agent-browser:
bun run bench-game-ui http://127.0.0.1:6031/storybook-static/ --budget docs/game-ui-budget.json
```

Raw samples, warmup flags, source revision/dirty state, browser information and
summary statistics are written to ignored `.local/benchmarks/game-ui.json`.
Use `--output path.json` to retain multiple runs. To capture a new reference on a
chosen target environment, use `--write-budget path.json` and review the resulting
limits deliberately. Do not overwrite a reference merely to conceal a regression.

For high-frequency counters that do not need tweening, supply formatted text to
`Resource` instead of a numeric animated value. Keep chart histories bounded and
avoid rebuilding unrelated inventories for every resource update. Measure these
application choices with the same fixture rather than claiming an unmeasured gain.
