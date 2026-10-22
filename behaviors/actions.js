import { createLazyResource } from "./resource.js";
// Each action has one owner. Reject collisions instead of silently overriding a feature.
export function createActionRouter(groups) {
  const handlers = new Map();
  for (const group of groups) {
    for (const [name, handler] of Object.entries(group)) {
      if (handlers.has(name)) throw new Error(`Duplicate UI action: ${name}`);
      handlers.set(name, handler);
    }
  }
  return (button, event) => handlers.get(button.dataset.action)?.(button, event);
}

/** Load action groups only when invoked. Action names and services belong to the host. */
export function createLazyActionRouter({ groups = [], features = {}, onError = () => {} }) {
  const route = createActionRouter(groups);
  const known = new Set(groups.flatMap(Object.keys));
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
