import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { meta, range, select } from "../helpers.ts";
import { RecordedHistory, type RecordedHistoryProps } from "./recorded-history.tsx";
import { renderReactStory } from "./story-host.ts";

const args: RecordedHistoryProps = { preset: "gaps", width: 720 };

const storyMeta: Meta<RecordedHistoryProps> = {
  ...meta(
    "React/Recorded history",
    "TanStack Charts with explicit units, missing observations and an always-visible exact-data fallback. Sample data is synthetic; the application remains the authority for recorded values.",
    args,
    {
      preset: select(
        ["gaps", "zero", "signed", "empty"],
        "Recorded observations, without interpolation.",
      ),
      width: range(240, 1000, 20, "Maximum chart width; remains within the available canvas."),
    },
  ),
  title: "React/Recorded history",
  tags: ["autodocs"],
  render: (props) => renderReactStory(RecordedHistory, props),
};
export default storyMeta;
type Story = StoryObj<RecordedHistoryProps>;
export const MissingDay: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByRole("table")).toBeVisible();
    await expect(canvas.getByText("Not recorded")).toBeVisible();
    await expect(canvas.getByRole("row", { name: "Day 4 0" })).toBeVisible();
  },
};
export const Zero: Story = { args: { preset: "zero" } };
export const Signed: Story = { args: { preset: "signed" } };
export const Empty: Story = { args: { preset: "empty" } };
export const Narrow: Story = { args: { width: 240 } };
