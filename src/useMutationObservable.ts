import { useEffect, useMemo } from 'react';
import debounce from './lib/debounce';

export interface MutationObservableConfig extends MutationObserverInit {
  /**
   * Time in [ms] to debounce all calls.
   *
   * Please keep in mind that when using debouncing, you will only receive last
   * set of mutations fired.
   */
  debounceMs?: number;
}

/**
 * This custom hooks abstracts the usage of the Mutation Observer with React
 * components. Watches for changes being made to the DOM tree and trigger a custom
 * callback.
 *
 * @param targetEl DOM element to be observed
 * @param cb callback that will run when there's a change in targetEl or any
 * child element (depending on the provided config)
 * @param config Please see
 * https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe
 * for standard MutationObserver config options
 */
export default function useMutationObservable(
  targetEl: Node | null | undefined,
  cb: MutationCallback,
  { debounceMs, ...config }: MutationObservableConfig = {
    attributes: true,
    childList: true,
    subtree: false,
  }
): void {
  const callback = useMemo(() => debounce(cb, debounceMs), [cb, debounceMs]);

  const observer = useMemo(
    () =>
      new MutationObserver((entries, observer) => {
        // This might be not needed, as I've obsevrved no issues like with
        // ResizeObserver, but let's do it in same manner as ResizeObserver.
        window.requestAnimationFrame(() => {
          // Don't continue when there are no observations in entries
          if (!Array.isArray(entries) || entries.length === 0) {
            return;
          }
          callback(entries, observer);
        });
      }),
    [callback]
  );

  useEffect(() => {
    if (targetEl) observer.observe(targetEl, config);

    return () => {
      observer.disconnect();
      callback.cancel();
    };
  }, [targetEl, config, observer, callback]);
}
