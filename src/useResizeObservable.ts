import { useEffect, useMemo } from 'react';
import debounce from './lib/debounce';

export interface ResizeObservableConfig extends ResizeObserverOptions {
  /**
   * Time in [ms] to debounce all calls.
   *
   * Please keep in mind that when using debouncing, you will only receive last
   * resize observation entries.
   */
  debounceMs?: number;
}

/**
 * This custom hooks abstracts the usage of the Resize Observer with React
 * components. Watches for changes in size to the supplied DOM element and
 * triggers a custom callback.
 *
 * @param targetEl DOM element to be observed
 * @param cb callback that will run when there's a change in targetEl size
 * @param config Please see
 * https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/observe for
 * standard ResizeObserver config options
 */
export default function useResizeObservable(
  targetEl: Element | null | undefined,
  cb: ResizeObserverCallback,
  { debounceMs, ...config }: ResizeObservableConfig = {
    box: 'content-box',
  }
): void {
  const callback = useMemo(() => debounce(cb, debounceMs), [cb, debounceMs]);

  const observer = useMemo(
    () =>
      new ResizeObserver((entries, observer) => {
        // To avoid errors like: ResizeObserver loop limit exceeded
        // we do wrap callback logic in rAF
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
    // Only observer when non-null target element is supplied
    if (targetEl) observer.observe(targetEl, config);

    return () => {
      observer.disconnect();
      callback.cancel();
    };
  }, [targetEl, config, observer, callback]);
}
