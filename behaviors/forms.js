/** @typedef {{format?: (value: number, input: HTMLInputElement) => string}} RangeBindingOptions */
/** Optional slider helper: mirrors each range value into its <output> and sets --rw-fill. Native inputs stay the source of truth. */
/** @param {ParentNode} [root] @param {RangeBindingOptions} [options] */
export function bindRanges(root = document, { format = (value) => String(value) } = {}) {
  const abort = new AbortController();
  /** @param {HTMLInputElement} input */
  const sync = (input) => {
    const min = Number(input.min || 0),
      max = Number(input.max || 100),
      value = Number(input.value);
    input.style.setProperty("--rw-fill", `${max > min ? ((value - min) / (max - min)) * 100 : 0}%`);
    const out =
      input.id &&
      /** @type {HTMLOutputElement | null} */ (
        root.querySelector(`output[for~="${CSS.escape(input.id)}"]`)
      );
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
  /** @type {NodeListOf<HTMLInputElement>} */ (
    root.querySelectorAll("input[type=range].rw-range")
  ).forEach(sync);
  return {
    destroy() {
      abort.abort();
      /** @type {NodeListOf<HTMLInputElement>} */ (
        root.querySelectorAll("input[type=range].rw-range")
      ).forEach((i) => {
        i.style.removeProperty("--rw-fill");
      });
    },
  };
}
