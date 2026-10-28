export type RangeBindingOptions = {
  format?: (value: number, input: HTMLInputElement) => string;
};

/** Optional slider helper: mirrors each range value into its <output> and sets --rw-fill. Native inputs stay the source of truth. */

export function bindRanges(
  root: ParentNode = document,
  { format = (value) => String(value) }: RangeBindingOptions = {},
): {
  destroy(): void;
} {
  const abort = new AbortController();
  let destroyed = false;

  const sync = (input: HTMLInputElement) => {
    const min = Number(input.min || 0),
      max = Number(input.max || 100),
      value = Number(input.value);
    input.style.setProperty("--rw-fill", `${max > min ? ((value - min) / (max - min)) * 100 : 0}%`);
    const out =
      input.id &&
      (root.querySelector(`output[for~="${CSS.escape(input.id)}"]`) as HTMLOutputElement | null);
    if (out) out.value = format(value, input);
  };
  root.addEventListener(
    "input",
    (event) => {
      if (
        event.target instanceof HTMLInputElement &&
        event.target.matches("input[type=range].rw-range")
      )
        sync(event.target);
    },
    { signal: abort.signal },
  );
  (root.querySelectorAll("input[type=range].rw-range") as NodeListOf<HTMLInputElement>).forEach(
    sync,
  );
  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      abort.abort();
      (root.querySelectorAll("input[type=range].rw-range") as NodeListOf<HTMLInputElement>).forEach(
        (i) => {
          i.style.removeProperty("--rw-fill");
        },
      );
    },
  };
}
