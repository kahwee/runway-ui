import {
  escapeHTML as e,
  text,
  flag,
  select,
  meta,
  uniqueId,
} from "./helpers.js";
const args = {
  title: "Chart the next frontier?",
  description:
    "This expedition costs 200 credits. Your crew will return after three cycles.",
  eyebrow: "Expedition ready",
  triggerLabel: "Open decision",
  confirmLabel: "Confirm expedition",
  cancelLabel: "Cancel",
  size: "default",
  tone: "neutral",
  footer: "end",
  dismissal: "any",
  showCancel: true,
  showClose: true,
  confirmDisabled: false,
  autofocus: "cancel",
  styled: true,
};
const argTypes = {
  title: text("Heading referenced by aria-labelledby."),
  description: {
    ...text(
      "Body text referenced by aria-describedby; long text scrolls inside the body.",
    ),
    control: "text",
  },
  eyebrow: text("Optional short context label."),
  triggerLabel: text("Native invoker button text."),
  confirmLabel: text("Submit button label; returnValue is confirm."),
  cancelLabel: {
    ...text("Cancel action label; returnValue is cancel."),
    if: { arg: "showCancel" },
  },
  size: select(
    ["compact", "default", "wide"],
    "Class modifier: g-dialog--compact, base g-dialog, or g-dialog--wide.",
  ),
  tone: select(
    ["neutral", "danger"],
    "Danger adds g-dialog--danger and a danger action.",
  ),
  footer: select(
    ["end", "split", "stacked"],
    "Class modifier on g-dialog__footer.",
  ),
  styled: flag(
    "Toggle g-dialog and its BEM classes. Off shows an ordinary unstyled native dialog.",
    "Appearance",
  ),
  dismissal: select(
    ["any", "closerequest", "none"],
    "Native closedby: backdrop + Escape, Escape only, or explicit buttons only. Older browsers need the optional policy helper.",
    "HTML",
  ),
  showCancel: flag("Include an explicit cancel button.", "Content"),
  showClose: flag('Include a native command="close" button.', "Content"),
  confirmDisabled: flag("Native disabled state on the confirm action."),
  autofocus: select(
    ["cancel", "confirm"],
    "Initial focus preference; falls back when the chosen action is absent or disabled.",
    "HTML",
  ),
};
export default {
  title: "Foundations/Dialog",
  tags: ["autodocs"],
  ...meta(
    "Foundations/Dialog",
    "Style native dialogs by class. .g-dialog owns the surface; .g-dialog__header, __body and __footer own layout. Modifiers change size, tone and footer arrangement. Native invoker commands open and close the modal without application event handlers. Edit args, then open the dialog to inspect the result. Browser focus and inertness remain native.",
    args,
    argTypes,
  ),
};

export const Playground = {
  render: (a) => {
    if (
      !a.showCancel &&
      !a.showClose &&
      a.confirmDisabled &&
      a.dismissal === "none"
    )
      return '<p role="alert">Keep at least one enabled explicit exit action when dismissal is disabled.</p>';
    const id = uniqueId("decision");
    const classes = a.styled
      ? [
          "g-ui",
          "g-dialog",
          a.size !== "default" ? `g-dialog--${a.size}` : "",
          a.tone === "danger" ? "g-dialog--danger" : "",
        ]
          .filter(Boolean)
          .join(" ")
      : "";
    const c = (part) => (a.styled ? ` class="g-dialog__${part}"` : "");
    const focusCancel =
      (a.autofocus === "cancel" && a.showCancel) ||
      (a.autofocus === "confirm" && a.confirmDisabled && a.showCancel);
    const focusConfirm =
      !a.confirmDisabled && (!a.showCancel || a.autofocus === "confirm");
    return `<div class="story-width"><p class="g-kicker">${a.styled ? e(classes) : "Native dialog · no styling class"}</p><button class="g-button" data-variant="primary" commandfor="${id}" command="show-modal">${e(a.triggerLabel)}</button><dialog${classes ? ` class="${e(classes)}"` : ""} id="${id}" closedby="${e(a.dismissal)}" aria-labelledby="${id}-title" aria-describedby="${id}-description"><header${c("header")}><div>${a.eyebrow ? `<p${c("eyebrow")}>${e(a.eyebrow)}</p>` : ""}<h2${c("title")} id="${id}-title">${e(a.title)}</h2></div>${a.showClose ? `<button${c("close")} type="button" aria-label="Close dialog" commandfor="${id}" command="close">×</button>` : ""}</header><div${c("body")}><p id="${id}-description">${e(a.description)}</p></div><form method="dialog"${a.styled ? ` class="g-dialog__footer${a.footer !== "end" ? ` g-dialog__footer--${a.footer}` : ""}"` : ""}>${a.showCancel ? `<button class="g-button" value="cancel"${focusCancel ? " autofocus" : ""}>${e(a.cancelLabel)}</button>` : ""}<button class="g-button" data-variant="${a.tone === "danger" ? "danger" : "primary"}" value="confirm"${a.confirmDisabled ? " disabled" : ""}${focusConfirm ? " autofocus" : ""}>${e(a.confirmLabel)}</button></form></dialog></div>`;
  },
};
