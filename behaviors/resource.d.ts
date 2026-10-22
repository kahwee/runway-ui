export interface LazyResource<T> {
  readonly attempts: number;
  readonly value: T | undefined;
  readonly error: unknown;
  load(): Promise<T>;
}
/** Pure cache; owns no listeners. Failed loads can retry; successful values include falsy values. */
export declare function createLazyResource<T>(
  load: (attempt: number) => T | PromiseLike<T>,
  onChange?: () => void,
): LazyResource<T>;
/** Requires an absolute URL; preserves query parameters and fragments. */
export declare function resourceUrl(url: string | URL, attempt?: number): string;
