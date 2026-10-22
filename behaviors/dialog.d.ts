export interface DialogController {
  open(): void;
  /** Reapply the current dismissal policy to the native closedby attribute. */
  refresh(): void;
  /** True means a request was issued, not that closing could not be canceled. */
  requestClose(returnValue?: string): boolean;
  /** Removes helper behavior and restores closedby; does not close the dialog. */
  destroy(): void;
}
export declare function bindDialog(
  dialog: HTMLDialogElement,
  options?: {
    canDismiss?: () => boolean;
  },
): DialogController;
