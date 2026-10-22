/** @typedef {(button: HTMLButtonElement, event: Event) => unknown} ActionHandler */
/** @typedef {Record<string, ActionHandler>} ActionGroup */
/** @typedef {{groups?: ActionGroup[], features?: Record<string, {names: string[], load(attempt: number): ActionGroup | PromiseLike<ActionGroup>}>, onError?: (error: unknown, action: string) => unknown}} LazyActionOptions */
import { createLazyResource } from "./resource.js";
// Each action has one owner. Reject collisions instead of silently overriding a feature.
/** @param {ActionGroup[]} groups @returns {ActionHandler} */
export function createActionRouter(groups) {
  const handlers = new Map();
  for (const group of groups) {
    for (const [name, handler] of Object.entries(group)) {
      if (handlers.has(name)) throw new Error(`Duplicate UI action: ${name}`);
      handlers.set(name, handler);
    }
  }
  return (button, event) => {
    const name = button.dataset.action;
    return name === undefined ? undefined : handlers.get(name)?.(button, event);
  };
}

/** Load action groups only when invoked. Action names and services belong to the host. */
/** @param {LazyActionOptions} options @returns {ActionHandler} */
export function createLazyActionRouter({ groups = [], features = {}, onError = () => {} }) {
  const route = createActionRouter(groups);
  const known = new Set(groups.flatMap(Object.keys));
  /** @type {Map<string, import("./resource.js").LazyResource<ActionGroup>>} */
  const owners = new Map();
  for (const [feature, { names, load }] of Object.entries(features)) {
    const resource = createLazyResource(async (attempt) => {
      const handlers = await load(attempt);
      const actual = Object.keys(handlers).sort();
      const expected = [...names].sort();
      if (actual.length !== expected.length || actual.some((name, i) => name !== expected[i]))
        throw new Error(`Action ownership index is out of date: ${feature}`);
      for (const handler of Object.values(handlers))
        if (typeof handler !== "function") throw new TypeError("Action handlers must be functions");
      return handlers;
    });
    for (const name of names) {
      if (known.has(name)) throw new Error(`Duplicate UI action: ${name}`);
      known.add(name);
      owners.set(name, resource);
    }
  }
  const busy = new WeakSet();
  return (button, event) => {
    const name = button.dataset.action;
    if (name === undefined) return;
    const resource = owners.get(name);
    if (!resource) return route(button, event);
    if (busy.has(button)) return;
    if (resource.value) return resource.value[name](button, event);
    const disabled = button.disabled;
    busy.add(button);
    button.disabled = true;
    return resource
      .load()
      .then((handlers) => {
        if (button.isConnected === false || button.dataset.action !== name) return;
        return handlers[name](button, event);
      })
      .catch((error) => onError(error, name))
      .finally(() => {
        busy.delete(button);
        button.disabled = disabled;
      });
  };
}
