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
  const observer = useMemo(
    () =>
      new MutationObserver(
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
