import assert from "node:assert/strict";
import test from "node:test";
import { bindDialog } from "../behaviors/dialog.js";

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
    requestClose(value) {
      if (this.dispatchEvent(new Event("cancel", { cancelable: true }))) {
        this.open = false;
        this.modal = false;
        if (value !== undefined) this.returnValue = value;
      }
    },
  });
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

test("unsupported dialog implementations fail before binding listeners", () => {
  const dialog = nativeDialog();
  dialog.requestClose = undefined;
  assert.throws(() => bindDialog(dialog), /requestClose/);
});

test("native light-dismiss capability is required", () => {
  const dialog = nativeDialog();
  delete dialog.closedBy;
  assert.throws(() => bindDialog(dialog), /closedBy/);
});
