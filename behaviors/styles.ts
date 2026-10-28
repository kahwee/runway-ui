// Keep each link in its original cascade position; never append a replacement.

const pending: WeakMap<HTMLLinkElement, Promise<void>> = new WeakMap();

export function loadStylesheet(
  link: HTMLLinkElement,
  href: string | undefined = link.dataset.href,
): Promise<void> {
  if (link.sheet) return Promise.resolve();
  const current = pending.get(link);
  if (current) return current;
  if (!href) return Promise.reject(new TypeError("A stylesheet URL is required"));
  // The executor assigns these synchronously, before listeners or href can settle the load.

  let resolve: () => void = () => {};

  let reject: (reason?: unknown) => void = () => {};

  const promise: Promise<void> = new Promise((yes, no) => {
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
