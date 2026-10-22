/**
 * @template T
 * @typedef {{readonly attempts: number, readonly value: T | undefined, readonly error: unknown, load(): Promise<T>}} LazyResource
 */
/** Cache a feature's module, coalesce concurrent opens, and retry failed downloads. */
/**
 * @template T
 * @param {(attempt: number) => T | PromiseLike<T>} load
 * @param {() => void} [onChange]
 * @returns {LazyResource<T>}
 */
export function createLazyResource(load, onChange = () => {}) {
  let loaded = false,
    /** @type {T | undefined} */
    value,
    /** @type {unknown} */
    error,
    /** @type {Promise<T> | undefined} */
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
      if (loaded) return Promise.resolve(/** @type {T} */ (value));
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
              return result;
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
/** @param {string | URL} url @param {number} [attempt] */
export function resourceUrl(url, attempt = 1) {
  const result = new URL(url);
  if (attempt > 1) result.searchParams.set("retry", String(attempt));
  return result.href;
}
