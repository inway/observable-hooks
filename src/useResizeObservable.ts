import { useEffect, useMemo } from 'react';
import debounce from './lib/debounce';

export interface ResizeObservableConfig extends ResizeObserverOptions {
  /**
   * Time in [ms] to debounce all calls.
   *
   * Please keep in mind that when using debouncing, you will only receive last
   * resize event.
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
  const observer = useMemo(
    () =>
      new ResizeObserver(
        debounceMs == undefined ? cb : debounce(cb, debounceMs)
      ),
    [cb, debounceMs]
  );

  useEffect(() => {
    if (targetEl) {
      observer.observe(targetEl, config);
      return () => {
        observer.disconnect();
      };
    }
  }, [targetEl, config, observer]);
}
