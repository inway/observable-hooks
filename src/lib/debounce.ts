/* eslint-disable @typescript-eslint/no-explicit-any */

export default function debounce<Params extends any[]>(
  func: (...params: Params) => any,
  delay: number
) {
  let debounceTimer: NodeJS.Timeout | number | any;
  return function (this: any, ...args: Params) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(this, args), delay);
  };
}
