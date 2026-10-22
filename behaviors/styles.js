// Keep each link in its original cascade position; never append a replacement.
const pending = new WeakMap();
export function loadStylesheet(link, href = link.dataset.href) {
  if (link.sheet) return Promise.resolve();
  if (pending.has(link)) return pending.get(link);
  if (!href) return Promise.reject(new TypeError("A stylesheet URL is required"));
  let resolve, reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  pending.set(link, promise);
  const cleanup = () => {
    link.removeEventListener("load", success);
    link.removeEventListener("error", failure);
    pending.delete(link);
  };
  const success = () => {
    cleanup();
    resolve();
  };
  const failure = () => {
    cleanup();
    link.removeAttribute("href");
    reject(new Error("Panel styles could not load."));
  };
  link.addEventListener("load", success);
  link.addEventListener("error", failure);
  try {
    link.href = href;
  } catch (error) {
    cleanup();
    reject(error);
  }
  return promise;
}
