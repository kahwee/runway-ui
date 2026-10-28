import { useId, useState } from "react";
import { Button, InputScope, InputHints, Dialog, type InputBinding } from "../../react/index.ts";

export type InputExampleProps = { gamepad: boolean; loop: boolean; width: number };
export function InputExample({ gamepad, loop, width }: InputExampleProps) {
  const titleId = `input-decision-${useId()
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase()}`;
  const [controller, setController] = useState(gamepad);
  const [message, setMessage] = useState("No action yet");
  const [key, setKey] = useState("n");
  const [open, setOpen] = useState(false);
  const [required, setRequired] = useState(false);
  const bindings: InputBinding[] = [
    { id: "next", label: "Next cycle", key, onActivate: () => setMessage("Cycle advanced") },
  ];
  return (
    <section className="react-form-example" style={{ maxInlineSize: width }}>
      <h2>Command station</h2>
      <InputScope
        aria-label="Commands"
        columns={3}
        loop={loop}
        gamepad={controller}
        bindings={bindings}
        onBack={() => setMessage("Back requested")}
      >
        <div className="react-input-grid">
          {["Build", "Unavailable", "Research", "Trade", "Rest", "Explore"].map((label) => (
            <Button
              key={label}
              data-rw-focus-item=""
              disabled={label === "Unavailable"}
              onClick={() => setMessage(`${label} selected`)}
            >
              {label}
            </Button>
          ))}
        </div>
        <InputHints bindings={bindings} />
        <Button onClick={() => setController((value) => !value)}>
          {controller ? "Disable controller" : "Enable controller"}
        </Button>
        <p className="rw-muted">
          Arrows move; Home/End jump. Tab stays native. Controller: D-pad/stick moves, A/Cross
          selects, B/Circle goes back.
        </p>
        <label className="rw-field">
          Notes <input className="rw-input" placeholder="Shortcuts leave typing alone" />
        </label>
        <Button onClick={() => setKey(key === "n" ? "x" : "n")}>Remap next-cycle key</Button>
        <InputScope
          aria-label="Nested commands"
          bindings={[
            {
              id: "nested",
              label: "Nested action",
              key: "n",
              onActivate: () => setMessage("Nested action"),
            },
          ]}
        >
          <Button data-rw-focus-item="" onClick={() => setMessage("Nested selected")}>
            Nested command
          </Button>
        </InputScope>
        <Button onClick={() => setOpen(true)}>Open decision</Button>
        <Dialog
          open={open}
          onClose={(value) => {
            setOpen(false);
            setMessage(`Decision: ${value || "dismissed"}`);
          }}
          canDismiss={() => !required}
          aria-labelledby={titleId}
        >
          <div className="rw-dialog__header">
            <h2 id={titleId}>Review decision</h2>
          </div>
          <div className="rw-dialog__body">
            <label>
              <input
                type="checkbox"
                checked={required}
                onChange={(event) => setRequired(event.target.checked)}
              />{" "}
              Require an explicit decision
            </label>
            <p>Escape and backdrop requests respect the decision guard.</p>
          </div>
          <form method="dialog" className="rw-dialog__footer">
            <Button type="submit" value="cancel">
              Cancel decision
            </Button>
            <Button type="submit" value="confirm">
              Confirm decision
            </Button>
          </form>
        </Dialog>
      </InputScope>
      <p role="status">{message}</p>
      <Button onClick={() => setMessage("Outside selected")}>Outside command scope</Button>
    </section>
  );
}
