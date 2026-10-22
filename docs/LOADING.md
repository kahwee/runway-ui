# Loading reusable game features

Runway provides optional, independent ES modules for feature loading. They do not
import application views, rules, styles or services. Use direct entries so an
unopened feature stays out of the startup graph. No framework or bundler is required.
Try the [standalone supply desk](../examples/lazy-workspace/index.html).

## Resource cache

```js
import { createLazyResource, resourceUrl } from "runway-ui/resource";
const panel = createLazyResource(
  (attempt) => import(resourceUrl(new URL("./panel.js", import.meta.url), attempt)),
);
await panel.load();
```

`load()` coalesces concurrent requests, caches all successful values (including
`undefined`, `false` and zero), and allows explicit retry after rejection.
`attempts`, `value` and `error` are read-only observations. An optional second
callback runs after success or failure; keep it synchronous and non-throwing.
This cache owns no DOM listeners or timers. The host owns its lifetime and rendering.
Read current simulation state when rendering, rather than capturing a snapshot
before download. Completing a download must not change the user's navigation.

`resourceUrl(absoluteUrl, attempt)` preserves query and fragment, adding `retry`
only after the first attempt. Resolve paths at the host, never relative to the
library. A changed entry URL can retry a failed entry import; failed dependencies
may remain in the browser module map and require a reload. This is not a generic
network cache invalidation or offline system.

## Deferred styles

Place a link without `href` in its intended cascade position:

```html
<link rel="stylesheet" data-href="./panel.css" id="panel-style">
```

```js
import { loadStylesheet } from "runway-ui/styles";
await loadStylesheet(document.querySelector("#panel-style"));
```

An explicit second URL overrides `data-href`. Calls for the same link coalesce;
existing `sheet` resolves immediately. Errors clear `href` and permit retry. Load
listeners are removed on settlement without replacing host listeners. Keep the
link mounted until settlement. The host owns link creation, removal and cancellation
policy; there is no polling or fetch cancellation handle. Await styles alongside
the view before showing interactive controls. Keep critical styles eager.

## Actions on demand

```js
import { createLazyActionRouter } from "runway-ui/actions";
const dispatch = createLazyActionRouter({
  groups: [{ pause: () => clock.pause() }],
  features: {
    supply: {
      names: ["order"],
      load: async () => (await import("./supply.js")).createActions(services),
    },
  },
  onError: (error, name) => showError(name),
});
// Host event delegation calls: await dispatch(button, event).
```

Names must be unique across eager and lazy groups. Loaded handlers must match
registered names exactly and be functions. Factories run once after a successful
load, retaining feature-local state. Pending buttons are disabled and restored;
repeat dispatch from the same pending button is ignored. Removed buttons and nodes
whose action changed during loading never run. Different buttons share the download
but each requested action runs. Handlers read live host state. `onError` receives
lazy loading and first-invocation failures; cached/eager handler failures propagate
to the caller. Await dispatch before observing effects. The router installs no
listeners; remove host event delegation on unmount. `createActionRouter(groups)`
provides the eager-only form, with the same duplicate-name protection.

## Ownership for another game

Reuse Runway's controls, native dialogs, navigation, history renderers, layouts and
these loading behaviors. Keep feature names, resource manifests, save formats,
simulation clocks, engine workers, economies and artwork in the host. A UI library
must not become a second rules engine. The example deliberately keeps its supply
counter and action names outside the library.
