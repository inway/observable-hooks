/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Simplest possible debounce implementation with calls at trailing edge.
 *
 * @param func - function to debounce
 * @param delay - number of milliseconds to delay
 * @returns
 */
export default function debounce<Params extends any[]>(
  func: (...params: Params) => any,
  delay: number | undefined
) {
  let debounceTimer: NodeJS.Timeout | undefined;

  function cancel() {
    if (debounceTimer !== undefined) {
      clearTimeout(debounceTimer);
      debounceTimer = undefined;
    }
  }

  function debounced(this: any, ...args: Params) {
    if (debounceTimer !== undefined) {
      clearTimeout(debounceTimer);
      debounceTimer = undefined;
    }

    if (typeof delay === 'number' && delay > 0)
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    else func.apply(this, args);
  }
  debounced.cancel = cancel;

  return debounced;
}
