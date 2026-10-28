import { Badge, Icon, Meter, Panel, Resource, Runway, type Tone } from "../../react/index.ts";

export type ComponentsExampleProps = {
  title: string;
  energy: number;
  tone: Tone;
  badge: string;
  theme: "cozy" | "cozy-night" | "ledger" | "whimsy";
};

/** Panel, badge, meter and resource bar assembled the way a game screen would. */
export function ComponentsExample({ title, energy, tone, badge, theme }: ComponentsExampleProps) {
  return (
    <Runway theme={theme} style={{ padding: 20, maxInlineSize: 520 }}>
      <Panel kicker="Today" title={title} actions={<Badge>{badge}</Badge>}>
        <div style={{ display: "flex", gap: 8, marginBlock: 12 }}>
          <Resource icon={<Icon name="coins" />} label="Credits" value="12,400" />
          <Resource icon={<Icon name="heart" />} label="Morale" value="86" />
        </div>
        <Meter icon={<Icon name="lightning" />} label="Team energy" value={energy} tone={tone} />
      </Panel>
    </Runway>
  );
}
