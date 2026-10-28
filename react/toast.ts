import { Toast } from "@base-ui/react/toast";
import { createElement, type ReactNode } from "react";

export type ToastTone = "success" | "warning" | "danger";

function ToastStack() {
  const { toasts } = Toast.useToastManager();
  return createElement(
    Toast.Viewport,
    { className: "rw-toasts" },
    toasts.map((toast) =>
      createElement(
        Toast.Root,
        { key: toast.id, toast, className: "rw-toast" },
        createElement(Toast.Title, { className: "rw-toast__title" }),
        createElement(Toast.Close, { className: "rw-toast__close", "aria-label": "Dismiss" }, "×"),
      ),
    ),
  );
}

/** Base UI toast provider with a Runway-styled stack. Mount it once inside `Runway`. */
export function ToastProvider({
  children,
  timeout = 3600,
  limit = 4,
}: {
  children?: ReactNode;
  timeout?: number;
  limit?: number;
}) {
  return createElement(Toast.Provider, { timeout, limit }, children, createElement(ToastStack));
}

/** Push and dismiss toasts. Must be used under `ToastProvider`. */
export function useToasts() {
  const manager = Toast.useToastManager();
  return {
    toasts: manager.toasts,
    push: (message: ReactNode, tone?: ToastTone) => manager.add({ title: message, type: tone }),
    dismiss: (id?: string) => manager.close(id),
  };
}
