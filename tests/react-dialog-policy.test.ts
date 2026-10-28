import assert from "node:assert/strict";
import test from "node:test";
import { attachDialogPolicy } from "../react/dialog-policy.ts";

function fixture() {
  const dialog = Object.assign(new EventTarget(), {
    open: true,
    returnValue: "preserved",
    ownerDocument: { defaultView: { Event } },
    getBoundingClientRect: () => ({ left: 100, top: 100, right: 300, bottom: 300 }),
    close() {
      this.open = false;
      this.dispatchEvent(new Event("close"));
    },
  }) as unknown as HTMLDialogElement;
  const pointer = (type: string, overrides = {}) => {
    const event = Object.assign(new Event(type), {
      pointerId: 1,
      button: 0,
      isPrimary: true,
      clientX: 10,
      clientY: 10,
      ...overrides,
    });
    dialog.dispatchEvent(event);
  };
  const click = () => {
    pointer("pointerdown");
    pointer("pointerup");
  };
  return { dialog, pointer, click };
}

test("React dialog fallback dispatches cancel, honors external vetoes, and preserves return values", () => {
  const { dialog, click } = fixture();
  let allowed = false;
  const closed: string[] = [];
  const destroy = attachDialogPolicy(dialog, () => ({
    canDismiss: () => allowed,
    onClose: (value) => closed.push(value),
  }));
  click();
  assert.equal(dialog.open, true);
  allowed = true;
  dialog.addEventListener("cancel", (event) => event.preventDefault(), { once: true });
  click();
  assert.equal(dialog.open, true);
  assert.deepEqual(closed, []);
  click();
  assert.equal(dialog.open, false);
  assert.deepEqual(closed, ["preserved"]);
  destroy();
});

test("fallback rejects interrupted, secondary, mismatched and inside-ending gestures and cleans up", () => {
  for (const ending of ["cancel", "mismatch", "secondary", "inside", "close"]) {
    const { dialog, pointer } = fixture();
    const destroy = attachDialogPolicy(dialog, () => ({ canDismiss: () => true, onClose() {} }));
    pointer("pointerdown");
    if (ending === "cancel") pointer("pointercancel");
    if (ending === "close") dialog.dispatchEvent(new Event("close"));
    pointer(
      "pointerup",
      ending === "mismatch"
        ? { pointerId: 2 }
        : ending === "secondary"
          ? { isPrimary: false }
          : ending === "inside"
            ? { clientX: 200, clientY: 200 }
            : {},
    );
    assert.equal(dialog.open, true, ending);
    destroy();
    pointer("pointerdown");
    pointer("pointerup");
    assert.equal(dialog.open, true);
  }
});
