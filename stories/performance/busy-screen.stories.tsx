import type { StoryObj } from "@storybook/html-vite";
import { meta, range } from "../helpers.ts";
import { renderReactStory } from "../react/story-host.ts";
import { BusyScreen, type BusyScreenProps } from "./busy-screen.tsx";
import "./busy-screen.css";
export default { title: "Performance/Busy screen", tags: ["autodocs"] };
export const Benchmark: StoryObj<BusyScreenProps> = {
  ...meta(
    "Performance/Busy screen",
    "A repeatable synthetic workload using the actual resource, inventory and TanStack chart components. Use the production Storybook build for timing.",
    { resources: 200, slots: 1000, charts: 4, duration: 3000, rate: 10 },
    {
      resources: range(0, 500, 20, "Mounted, updating readouts."),
      slots: range(0, 2000, 100, "Mounted inventory slots; no virtualization."),
      charts: range(0, 6, 1, "Independent 120-point TanStack charts."),
      duration: range(1000, 10000, 1000, "Measurement duration in milliseconds."),
      rate: range(1, 30, 1, "Requested data updates per second."),
    },
  ),
  render: (args) => renderReactStory(BusyScreen, args),
};
