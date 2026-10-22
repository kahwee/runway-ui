export interface RangeBindingOptions { format?: (value: number, input: HTMLInputElement) => string; }
/** Keeps `output[for]` and the `--rw-fill` custom property in step with each `.rw-range`. */
export declare function bindRanges(root?: ParentNode, options?: RangeBindingOptions): { destroy(): void };
