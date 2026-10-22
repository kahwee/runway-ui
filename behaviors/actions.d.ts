export type ActionHandler = (button: HTMLButtonElement, event: Event) => unknown;
export type ActionGroup = Record<string, ActionHandler>;
export declare function createActionRouter(groups: ActionGroup[]): ActionHandler;
export declare function createLazyActionRouter(options: {
  groups?: ActionGroup[];
  features?: Record<
    string,
    { names: string[]; load(attempt: number): ActionGroup | PromiseLike<ActionGroup> }
  >;
  onError?: (error: unknown, action: string) => unknown;
}): ActionHandler;
