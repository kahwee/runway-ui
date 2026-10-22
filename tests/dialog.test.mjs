import assert from "node:assert/strict";
import test from "node:test";
import { bindDialog } from "../behaviors/dialog.js";

function nativeDialog() {
  const dialog = new EventTarget();
  const attributes = new Map();
  return Object.assign(dialog, {
    localName: "dialog",
    open: false,
    returnValue: "",
    getAttribute: (name) => attributes.get(name) ?? null,
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: (name) => attributes.delete(name),
    showModal() {
      this.open = true;
    },
    requestClose(value) {
      if (this.dispatchEvent(new Event("cancel", { cancelable: true }))) {
        this.open = false;
        if (value !== undefined) this.returnValue = value;
      }
    },
  });
}

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
  assert.equal(dialog.getAttribute("closedby"), "closerequest");
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
