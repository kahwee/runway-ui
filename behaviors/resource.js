/** Cache a feature's module, coalesce concurrent opens, and retry failed downloads. */
export function createLazyResource(load, onChange = () => {}) {
  let loaded = false,
    value,
    error,
    pending,
    attempts = 0;
  return {
    get attempts() {
      return attempts;
    },
    get value() {
      return value;
    },
    get error() {
      return error;
    },
    load() {
      if (loaded) return Promise.resolve(value);
      if (!pending) {
        error = undefined;
        pending = Promise.resolve()
          .then(() => load(++attempts))
          .then(
            (result) => {
              value = result;
              loaded = true;
              pending = undefined;
              onChange();
              return value;
            },
            (failure) => {
              error = failure;
              pending = undefined;
              onChange();
              throw failure;
            },
          );
      }
      return pending;
    },
  };
}

/** Build a retry URL without importing or resolving relative to the library. */
export function resourceUrl(url, attempt = 1) {
  const result = new URL(url);
  if (attempt > 1) result.searchParams.set("retry", String(attempt));
  return result.href;
}
