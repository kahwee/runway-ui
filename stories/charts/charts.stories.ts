import type { Meta, StoryObj } from "@storybook/html-vite";
import { ChartPlayground, type ChartPlaygroundProps } from "../../examples/charts/components.tsx";
import { meta, range, select } from "../helpers.ts";
import { renderReactStory } from "../react/story-host.ts";

const args: ChartPlaygroundProps = { kind: "columns", preset: "sample", width: 850, height: 200 };
const chartMeta: Meta<ChartPlaygroundProps> = {
  ...meta(
    "Charts/TanStack",
    "One plotting engine for columns, stacked and signed bars, lines and areas. Keyboard focus, axes and geometry come from TanStack Charts. Exact observations remain readable HTML.",
    args,
    {
      kind: select(
        ["columns", "stacked", "diverging", "area", "horizontal", "line"],
        "TanStack mark type.",
      ),
      preset: select(
        ["sample", "zero", "missing"],
        "Missing observations are not drawn as zero or connected across a gap.",
      ),
      width: range(240, 1100, 20, "Maximum width; adapts to its container."),
      height: range(140, 320, 20, "Chart height in CSS pixels."),
    },
  ),
  title: "Charts/TanStack",
  tags: ["autodocs"],
  render: (props) => renderReactStory(ChartPlayground, props),
};
export default chartMeta;
type Story = StoryObj<ChartPlaygroundProps>;
export const Columns: Story = { name: "Playground" };
export const Stacked: Story = { args: { kind: "stacked" } };
export const Signed: Story = { args: { kind: "diverging" } };
export const Area: Story = { args: { kind: "area" } };
export const Horizontal: Story = { args: { kind: "horizontal" } };
export const Missing: Story = { args: { kind: "line", preset: "missing" } };
export const Zero: Story = { args: { preset: "zero" } };
