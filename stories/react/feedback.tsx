import { useState } from "react";
import {
  AnimatedNumber,
  Button,
  Confetti,
  Meter,
  Panel,
  Runway,
  Toaster,
  useToasts,
} from "../../react/index.ts";

export type FeedbackExampleProps = {
  theme: "cozy" | "ledger" | "whimsy";
  startingValue: number;
};

/** Every bit of juice in one place: counting numbers, meter flash, confetti and toasts. */
export function FeedbackExample({ theme, startingValue }: FeedbackExampleProps) {
  const [credits, setCredits] = useState(startingValue);
  const [energy, setEnergy] = useState(70);
  const [burst, setBurst] = useState(false);
  const { toasts, push, dismiss } = useToasts();
  return (
    <Runway theme={theme} style={{ padding: 20, maxInlineSize: 560 }}>
      <Panel kicker="Playground" title="Feedback and motion">
        <p className="rw-muted" style={{ margin: "8px 0 16px" }}>
          Credits{" "}
          <strong style={{ fontSize: 28 }}>
            <AnimatedNumber value={credits} />
          </strong>
        </p>
        <Meter label="Team energy" value={energy} tone="morale" />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBlockStart: 18 }}>
          <Button data-variant="primary" data-attention onClick={() => setCredits((n) => n + 1250)}>
            Earn credits
          </Button>
          <Button onClick={() => setEnergy((n) => Math.max(0, n - 20))}>Tire out</Button>
          <Button onClick={() => setEnergy((n) => Math.min(100, n + 20))}>Rest</Button>
          <Button
            onClick={() => {
              setBurst(true);
              push("You reached a milestone!", "success");
            }}
          >
            Celebrate
          </Button>
          <Button data-variant="danger" onClick={() => push("The oven needs repairs.", "danger")}>
            Problem
          </Button>
        </div>
      </Panel>
      <Confetti active={burst} onDone={() => setBurst(false)} />
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </Runway>
  );
}
