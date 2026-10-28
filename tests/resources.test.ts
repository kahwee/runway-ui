import assert from "node:assert/strict";
import test from "node:test";
import { createLazyActionRouter } from "../behaviors/actions.ts";
import { createLazyResource, resourceUrl } from "../behaviors/resource.ts";
import { loadStylesheet } from "../behaviors/styles.ts";

test("resources coalesce and retry synchronous failures, caching falsy success", async () => {
  let attempts = 0;
  const resource = createLazyResource(() => {
    if (++attempts === 1) throw Error("offline");
    return 0;
  });
  const pending = resource.load();
  assert.equal(resource.load(), pending);
  await assert.rejects(pending, /offline/);
  assert.equal(await resource.load(), 0);
  assert.equal(await resource.load(), 0);
  assert.equal(resource.attempts, 2);
  assert.equal(resource.error, undefined);
});
test("retry URLs retain host base, query and fragment", () => {
  assert.equal(
    resourceUrl(new URL("https://example.org/panel.ts?v=abc#part"), 2),
    "https://example.org/panel.ts?v=abc&retry=2#part",
  );
});
test("lazy actions reject collisions and mismatched ownership", async () => {
  assert.throws(
    () =>
      createLazyActionRouter({
        groups: [{ buy() {} }],
        features: {
          market: {
            names: ["buy"],
            load() {
              return {};
            },
          },
        },
      }),
    /Duplicate/,
  );
  let failure;
  const route = createLazyActionRouter({
    features: { market: { names: ["buy"], load: () => ({ sell() {} }) } },
    onError: (error) => {
      failure = error;
    },
  });
  const button = { dataset: { action: "buy" }, disabled: false };
  await route(button as unknown as HTMLButtonElement, new Event("click"));
  assert.match(failure.message, /ownership/);
  assert.equal(button.disabled, false);
});
test("pending controls execute once and never execute a replacement action", async () => {
  let finish,
    runs = 0;
  const route = createLazyActionRouter({
    features: {
      market: {
        names: ["buy"],
        load: () =>
          new Promise((resolve) => {
            finish = resolve;
          }),
      },
    },
  });
  const button = { dataset: { action: "buy" }, disabled: false };
  const pending = route(button as unknown as HTMLButtonElement, new Event("click"));
  route(button as unknown as HTMLButtonElement, new Event("click"));
  await Promise.resolve();
  button.dataset.action = "sell";
  finish({
    buy() {
      runs++;
    },
  });
  await pending;
  assert.equal(runs, 0);
  assert.equal(button.disabled, false);
});
test("styles preserve slots, listeners, coalescing and retry", async () => {
  const events = new Map();
  const link = {
    dataset: { href: "/panel.css" },
    addEventListener: (name, fn) => events.set(name, fn),
    removeEventListener: (name) => events.delete(name),
    removeAttribute: () => {},
  };
  const first = loadStylesheet(link as unknown as HTMLLinkElement);
  assert.equal(loadStylesheet(link as unknown as HTMLLinkElement), first);
  events.get("error")();
  await assert.rejects(first, /styles/);
  assert.equal(events.size, 0);
  const second = loadStylesheet(link as unknown as HTMLLinkElement);
  events.get("load")();
  await second;
  assert.equal(events.size, 0);
  assert.equal((link as unknown as HTMLLinkElement).href, "/panel.css");
});

test("stylesheet setter failures release the cache and listeners for retry", async () => {
  const events = new Map();
  let fail = true;
  const link = {
    dataset: { href: "/panel.css" },
    set href(_value) {
      if (fail) throw new Error("Invalid URL");
    },
    addEventListener: (name, fn) => events.set(name, fn),
    removeEventListener: (name) => events.delete(name),
  };
  await assert.rejects(loadStylesheet(link as unknown as HTMLLinkElement), /Invalid URL/);
  assert.equal(events.size, 0);
  fail = false;
  const retry = loadStylesheet(link as unknown as HTMLLinkElement);
  events.get("load")();
  await retry;
});
