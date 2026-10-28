import assert from "node:assert/strict";
import test from "node:test";
import { bindDialog } from "../behaviors/dialog.ts";

function nativeDialog() {
  const dialog = new EventTarget();
  const attributes = new Map();
  return Object.assign(dialog, {
    localName: "dialog",
    closedBy: "auto",
    open: false,
    modal: false,
    returnValue: "",
    getAttribute: (name) => attributes.get(name) ?? null,
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: (name) => attributes.delete(name),
    showModal() {
      if (this.open && !this.modal)
        throw new DOMException("Dialog is already open nonmodally", "InvalidStateError");
      this.open = true;
      this.modal = true;
    },
    close(value) {
      this.open = false;
      this.modal = false;
      if (value !== undefined) this.returnValue = value;
      this.dispatchEvent(new Event("close"));
    },
    getBoundingClientRect: () => ({ left: 100, top: 100, right: 300, bottom: 300 }),
    requestClose(value) {
      if (this.dispatchEvent(new Event("cancel", { cancelable: true }))) {
        this.open = false;
        this.modal = false;
        if (value !== undefined) this.returnValue = value;
      }
    },
  }) as unknown as HTMLDialogElement & { modal: boolean };
}

test("opening an existing nonmodal dialog preserves the native state error", () => {
  const dialog = nativeDialog();
  dialog.open = true;
  const controller = bindDialog(dialog, { canDismiss: () => false });
  assert.throws(() => controller.open(), { name: "InvalidStateError" });
  assert.equal(dialog.open, true);
  assert.equal(dialog.modal, false);
  controller.destroy();
});

test("reopening a modal is idempotent and destroyed bindings cannot reopen it", () => {
  const dialog = nativeDialog();
  const controller = bindDialog(dialog);
  controller.open();
  dialog.returnValue = "preserved";
  controller.open();
  assert.equal(dialog.open, true);
  assert.equal(dialog.modal, true);
  assert.equal(dialog.returnValue, "preserved");
  controller.destroy();
  dialog.open = false;
  dialog.modal = false;
  controller.open();
  assert.equal(dialog.open, false);
  assert.equal(dialog.modal, false);
});

test("native close requests preserve dismissal guards, cancellation and return values", () => {
  const dialog = nativeDialog();
  let allowed = false;
  const controller = bindDialog(dialog, { canDismiss: () => allowed });
  controller.open();
  assert.equal(dialog.getAttribute("closedby"), "none");
  assert.equal(controller.requestClose("blocked"), false);
  assert.equal(dialog.dispatchEvent(new Event("cancel", { cancelable: true })), false);
  assert.equal(dialog.open, true);
  allowed = true;
  controller.refresh();
  assert.equal(dialog.getAttribute("closedby"), "any");
  dialog.addEventListener("cancel", (event) => event.preventDefault(), { once: true });
  assert.equal(controller.requestClose("vetoed"), true);
  assert.equal(dialog.open, true);
  assert.equal(dialog.returnValue, "");
  assert.equal(controller.requestClose("confirmed"), true);
  assert.equal(dialog.open, false);
  assert.equal(dialog.returnValue, "confirmed");
  assert.equal(controller.requestClose(), false);
});

test("destroy restores policy and removes the cancellation guard", () => {
  const dialog = nativeDialog();
  dialog.setAttribute("closedby", "any");
  const controller = bindDialog(dialog, { canDismiss: () => false });
  controller.open();
  controller.destroy();
  controller.destroy();
  assert.equal(dialog.getAttribute("closedby"), "any");
  assert.equal(dialog.open, true);
  assert.equal(dialog.dispatchEvent(new Event("cancel", { cancelable: true })), true);
  assert.equal(controller.requestClose(), false);
});

test("native showModal and close remain required", () => {
  for (const name of ["showModal", "close"]) {
    const dialog = nativeDialog();
    dialog[name] = undefined;
    assert.throws(() => bindDialog(dialog), /native HTMLDialogElement/);
  }
});

test("missing light-dismiss support binds without changing native modal opening", () => {
  const dialog = nativeDialog();
  delete dialog.closedBy;
  const policy = bindDialog(dialog);
  policy.open();
  assert.equal(dialog.modal, true);
  assert.equal(dialog.getAttribute("closedby"), "closerequest");
  policy.destroy();
});

test("missing requestClose preserves cancellation, dynamic guards and return values", () => {
  const dialog = nativeDialog();
  delete dialog.requestClose;
  delete dialog.closedBy;
  let allowed = false;
  const policy = bindDialog(dialog, { canDismiss: () => allowed });
  policy.open();
  assert.equal(policy.requestClose("blocked"), false);
  assert.equal(dialog.dispatchEvent(new Event("cancel", { cancelable: true })), false);
  assert.equal(dialog.open, true);
  allowed = true;
  policy.refresh();
  let cancels = 0;
  dialog.addEventListener(
    "cancel",
    (event) => {
      cancels++;
      event.preventDefault();
    },
    { once: true },
  );
  assert.equal(policy.requestClose("vetoed"), true);
  assert.equal(cancels, 1);
  assert.equal(dialog.open, true);
  assert.equal(dialog.returnValue, "");
  assert.equal(policy.requestClose("accepted"), true);
  assert.equal(dialog.open, false);
  assert.equal(dialog.returnValue, "accepted");
  policy.open();
  policy.requestClose();
  assert.equal(dialog.returnValue, "accepted", "omitted return value stays native");
  policy.destroy();
});

function pointer(dialog, type, overrides = {}) {
  dialog.dispatchEvent(
    Object.assign(new Event(type), {
      clientX: 50,
      clientY: 50,
      pointerId: 1,
      button: 0,
      isPrimary: true,
      ...overrides,
    }),
  );
}

test("fallback backdrop requires the same outside primary pointer gesture and respects policy", () => {
  const dialog = nativeDialog();
  delete dialog.closedBy;
  delete dialog.requestClose;
  let allowed = false;
  const policy = bindDialog(dialog, { canDismiss: () => allowed });
  const gesture = (down = {}, up = {}) => {
    pointer(dialog, "pointerdown", down);
    pointer(dialog, "pointerup", up);
  };
  policy.open();
  gesture();
  assert.equal(dialog.open, true, "mandatory decision cannot light-dismiss");
  allowed = true;
  policy.refresh();
  gesture({ clientX: 150, clientY: 150 });
  assert.equal(dialog.open, true, "drag from dialog padding to backdrop stays open");
  gesture({}, { clientX: 150, clientY: 150 });
  assert.equal(dialog.open, true, "drag from backdrop into dialog stays open");
  gesture({}, { pointerId: 2 });
  gesture({ button: 2 });
  gesture({ isPrimary: false });
  pointer(dialog, "pointerdown");
  pointer(dialog, "pointercancel");
  pointer(dialog, "pointerup");
  assert.equal(dialog.open, true, "mismatched, secondary and cancelled gestures stay open");
  dialog.addEventListener("cancel", (event) => event.preventDefault(), { once: true });
  gesture();
  assert.equal(dialog.open, true, "another listener can veto backdrop dismissal");
  gesture();
  assert.equal(dialog.open, false);
  policy.destroy();
});

test("destroy removes fallback listeners, restores policy and cannot disturb a replacement binding", () => {
  const dialog = nativeDialog();
  delete dialog.closedBy;
  delete dialog.requestClose;
  dialog.setAttribute("closedby", "any");
  const retired = bindDialog(dialog);
  retired.open();
  retired.destroy();
  assert.equal(dialog.getAttribute("closedby"), "any");
  const current = bindDialog(dialog, { canDismiss: () => false });
  current.refresh();
  retired.destroy();
  assert.equal(dialog.getAttribute("closedby"), "none");
  pointer(dialog, "pointerdown");
  pointer(dialog, "pointerup");
  assert.equal(dialog.open, true);
  current.destroy();
  assert.equal(dialog.dispatchEvent(new Event("cancel", { cancelable: true })), true);
  pointer(dialog, "pointerdown");
  pointer(dialog, "pointerup");
  assert.equal(dialog.open, true, "destroy never closes the native dialog");
});
