import { useMemo, useState } from "react";
import { areaY, lineY } from "@tanstack/charts";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import {
  Badge,
  Button,
  Chart,
  ChartCard,
  Confetti,
  CommandBar,
  ControlConsole,
  defineChart,
  Dossier,
  DossierList,
  FolioTabs,
  Meter,
  Runway,
  Sheet,
  Toaster,
  useToasts,
} from "../../react/index.ts";

export type DeskExampleProps = {
  title: string;
  startingCash: number;
  theme: "cozy" | "ledger" | "whimsy";
};
type Section = "overview" | "people" | "projects";
const sections: { id: Section; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "people", label: "People" },
  { id: "projects", label: "Projects" },
];
const roles = ["Operations lead", "Research lead"];

/** Small playable simulation: each day earns credits and tires the team. */
export function DeskExample({ title, startingCash, theme }: DeskExampleProps) {
  const [section, setSection] = useState<Section>("overview");
  const [history, setHistory] = useState([{ day: 1, cash: startingCash }]);
  const [hired, setHired] = useState<string[]>([]);
  const [celebrate, setCelebrate] = useState(false);
  const { toasts, push, dismiss } = useToasts();
  const today = history[history.length - 1];
  const energy = Math.max(10, 100 - (today.day - 1) * 7);
  const chart = useMemo(
    () =>
      defineChart({
        marks: [
          areaY(history, { x: "day", y: "cash", fillOpacity: 0.18 }),
          lineY(history, { x: "day", y: "cash", strokeWidth: 3 }),
        ],
        scales: {
          x: {
            scale: scaleLinear,
            axis: {
              label: "Day",
              ticks: {
                values: history
                  .filter((_, i) => i % Math.ceil(history.length / 8) === 0)
                  .map((row) => row.day),
              },
            },
          },
          y: { scale: scaleLinear, nice: true, grid: true, axis: { label: "Credits" } },
        },
        tooltip,
      }),
    [history],
  );
  const nextDay = () =>
    setHistory((days) => {
      const last = days[days.length - 1];
      const income = 1500 + hired.length * 900;
      return [...days, { day: last.day + 1, cash: last.cash + income - 400 }];
    });
  const endDay = () => {
    nextDay();
    push(
      `Day ${today.day + 1}: the bakery earned ${(1500 + hired.length * 900 - 400).toLocaleString("en-US")} credits.`,
      "success",
    );
  };
  const hire = (role: string) => {
    setHired((list) => [...list, role]);
    setCelebrate(true);
    push(`${role} joined the team!`, "success");
  };
  return (
    <Runway theme={theme} style={{ display: "grid", gap: 20, padding: 20, maxInlineSize: 1200 }}>
      <CommandBar
        title={title}
        stats={[
          { label: "Credits", value: today.cash.toLocaleString("en-US") },
          { label: "Team", value: 4 + hired.length },
        ]}
      />
      <div className="story-workspace-grid">
        <FolioTabs<Section>
          label="Workspace sections"
          items={sections}
          value={section}
          onValueChange={setSection}
        />
        <Sheet
          title={sections.find((item) => item.id === section)?.label}
          description="Bring the right people together."
        >
          {section === "people" ? (
            <DossierList>
              {roles.map((role) => (
                <Dossier
                  key={role}
                  kicker="Open position"
                  status={<Badge>{hired.includes(role) ? "Hired" : "Vacant"}</Badge>}
                  title={role}
                  description="A clear role, useful context, and one next action."
                  actions={
                    <Button
                      data-variant="primary"
                      disabled={hired.includes(role)}
                      onClick={() => hire(role)}
                    >
                      {hired.includes(role) ? "Welcome aboard" : "Review candidates"}
                    </Button>
                  }
                />
              ))}
            </DossierList>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              <Meter label="Team energy" value={energy} tone={energy < 40 ? "danger" : "morale"} />
              <Meter label="Projects on track" value={60 + hired.length * 15} tone="pm" />
              <ChartCard title="Credits by day" caption="Hire people to grow the curve.">
                <Chart definition={chart} height={240} ariaLabel="Credits by day" />
              </ChartCard>
            </div>
          )}
        </Sheet>
      </div>
      <ControlConsole>
        <strong>Day {today.day}</strong>
        <span>Ready for your next decision.</span>
        <Button data-variant="primary" data-attention onClick={endDay}>
          Next day
        </Button>
      </ControlConsole>
      <Confetti active={celebrate} onDone={() => setCelebrate(false)} />
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </Runway>
  );
}
