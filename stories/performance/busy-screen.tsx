import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { lineY } from "@tanstack/charts";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import {
  Button,
  Chart,
  ChartCard,
  Inventory,
  Resource,
  Runway,
  defineChart,
} from "../../react/index.ts";
import { bounded } from "../helpers.ts";
import { measureBusyScreen, type BenchmarkMetrics } from "./metrics.ts";

export type BusyScreenProps = {
  resources: number;
  slots: number;
  charts: number;
  duration: number;
  rate: number;
};
function History({ tick, index }: { tick: number; index: number }) {
  const definition = useMemo(
    () =>
      defineChart({
        marks: [
          lineY(
            Array.from({ length: 120 }, (_, i) => ({
              cycle: i,
              value: 50 + Math.sin((i + tick + index) / 8) * 20,
            })),
            { x: "cycle", y: "value" },
          ),
        ],
        scales: {
          x: { scale: scaleLinear },
          y: { scale: scaleLinear, domain: [0, 100], grid: true },
        },
      }),
    [tick, index],
  );
  return (
    <ChartCard title={`History ${index + 1}`}>
      <Chart definition={definition} height={180} ariaLabel={`Synthetic history ${index + 1}`} />
    </ChartCard>
  );
}
export function BusyScreen(props: BusyScreenProps) {
  const resources = bounded(props.resources, 0, 500, 200),
    slots = bounded(props.slots, 0, 2000, 1000);
  const charts = bounded(props.charts, 0, 6, 4),
    duration = bounded(props.duration, 1000, 10000, 3000),
    rate = bounded(props.rate, 1, 30, 10);
  const [tick, setTick] = useState(0),
    [running, setRunning] = useState(false),
    [result, setResult] = useState<BenchmarkMetrics>();
  const [receipt, setReceipt] = useState(0);
  const session = useRef<ReturnType<typeof measureBusyScreen> | null>(null);
  const pendingUpdate = useRef<number | null>(null),
    pendingInputs = useRef<number[]>([]);
  const items = useMemo(
    () => Array.from({ length: slots }, (_, i) => ({ id: `slot-${i}`, label: `Supply ${i + 1}` })),
    [slots],
  );
  useLayoutEffect(() => {
    if (pendingUpdate.current !== null) {
      session.current?.update(pendingUpdate.current);
      pendingUpdate.current = null;
    }
  }, [tick]);
  useLayoutEffect(() => {
    for (const start of pendingInputs.current) session.current?.input(start);
    pendingInputs.current = [];
  }, [receipt]);
  useEffect(() => {
    if (!running) return;
    session.current = measureBusyScreen();
    const interval = setInterval(() => {
      pendingUpdate.current = performance.now();
      setTick((value) => value + 1);
    }, 1000 / rate);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setResult(session.current!.finish());
      session.current = null;
      setRunning(false);
    }, duration);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      session.current?.cancel();
      session.current = null;
    };
  }, [running, rate, duration]);
  return (
    <Runway
      theme="cozy"
      className="busy-screen"
      data-benchmark-state={running ? "running" : result ? "complete" : "idle"}
    >
      <header>
        <h1>Busy-screen benchmark</h1>
        <p>
          {resources} updating resources · {slots} mounted inventory slots · {charts} charts × 120
          points · {rate} updates/second
        </p>
        <div className="busy-screen__actions">
          <Button
            disabled={running}
            data-benchmark-start=""
            onClick={() => {
              setResult(undefined);
              pendingInputs.current = [];
              setRunning(true);
            }}
          >
            Run benchmark
          </Button>
          <Button
            data-benchmark-probe=""
            onClick={(event) => {
              if (session.current) pendingInputs.current.push(event.timeStamp);
              setReceipt((value) => value + 1);
            }}
          >
            Check input response
          </Button>
        </div>
        <p role="status">
          {running ? "Measuring…" : result ? "Measurement complete" : "Ready"} · {receipt} input
          receipts
        </p>
      </header>
      {result && (
        <section aria-label="Benchmark results">
          <table>
            <tbody>
              <tr>
                <th>Frame time p95</th>
                <td>{result.frameP95Ms.toFixed(1)} ms</td>
              </tr>
              <tr>
                <th>Update to commit p95</th>
                <td>{result.updateP95Ms.toFixed(1)} ms</td>
              </tr>
              <tr>
                <th>Input to commit p95</th>
                <td>{result.inputP95Ms?.toFixed(1) ?? "No probe"} ms</td>
              </tr>
              <tr>
                <th>Long tasks</th>
                <td>{result.longTasksSupported ? result.longTaskCount : "Unavailable"}</td>
              </tr>
            </tbody>
          </table>
          <output hidden data-benchmark-results="">
            {JSON.stringify(result)}
          </output>
        </section>
      )}
      <div className="busy-screen__data">
        <section
          role="region"
          tabIndex={0}
          aria-label="Resource readouts"
          className="busy-screen__resources"
        >
          {Array.from({ length: resources }, (_, i) => (
            <Resource
              key={i}
              label={`Resource ${i + 1}`}
              value={1000 + i * 7 + tick * ((i % 5) + 1)}
            />
          ))}
        </section>
        <div
          className="busy-screen__inventory"
          tabIndex={0}
          role="region"
          aria-label="Inventory scroll"
        >
          <Inventory label="Benchmark supplies" items={items} columns={8} />
        </div>
      </div>
      <section aria-label="History charts" className="busy-screen__charts">
        {Array.from({ length: charts }, (_, i) => (
          <History key={i} index={i} tick={tick} />
        ))}
      </section>
      <p className="rw-muted">
        Synthetic stress fixture. Inventory deliberately mounts every slot; this is not
        virtualization. Keep the tab visible. Measurements exclude initial mounting and are specific
        to this workload and browser.
      </p>
    </Runway>
  );
}
