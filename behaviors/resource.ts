export type LazyResource<T> = {
  readonly attempts: number;
  readonly value: T | undefined;
  readonly error: unknown;
  load(): Promise<T>;
};

/** Cache a feature's module, coalesce concurrent opens, and retry failed downloads. */

export function createLazyResource<T>(
  load: (attempt: number) => T | PromiseLike<T>,
  onChange: () => void = () => {},
): LazyResource<T> {
  let loaded = false,
    value: T | undefined,
    error: unknown,
    pending: Promise<T> | undefined,
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
      if (loaded) return Promise.resolve(value as T);
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

export function resourceUrl(url: string | URL, attempt: number = 1): string {
  const result = new URL(url);
  if (attempt > 1) result.searchParams.set("retry", String(attempt));
  return result.href;
}
