import { useEffect, useState } from 'react';

export interface useMobileKeyboardOpenerOptions {
  callback?: () => void;
  enabled?: (e: Event) => boolean;
  event?: keyof HTMLElementEventMap; // must be user interactions
  focusOnInit?: boolean;
  helperId: string;
  preventScroll?: boolean;
  targetId: string;
}

export const useMobileKeyboardOpener = (
  options: useMobileKeyboardOpenerOptions,
) => {
  const defaultOptions = {
    callback: () => null,
    enabled: () => true,
    event: 'click',
    focusOnInit: false,
    preventScroll: false,
  };
  const [opt, setOptions] = useState({ ...defaultOptions, ...options });
  useEffect(() => {
    // options is commonly passed as a fresh object literal on every render
    // (this file's own MobileKeyboardOpener does exactly that), so callback
    // and enabled are near-guaranteed to be new function references even
    // when nothing meaningful changed. Only compare the primitive fields to
    // decide whether an update is needed; if none changed, bail out by
    // returning the previous state object, or this becomes an infinite
    // render loop for any caller that doesn't memoize its options.
    setOptions((prev) => {
      const merged = { ...defaultOptions, ...options };
      const reactiveKeys = [
        'event',
        'focusOnInit',
        'helperId',
        'preventScroll',
        'targetId',
      ] as const;
      const hasChanged = reactiveKeys.some((key) => merged[key] !== prev[key]);
      return hasChanged ? merged : prev;
    });
  }, [options]);

  useEffect(() => {
    const { callback, enabled, event, focusOnInit, helperId, preventScroll } =
      opt;

    const inputFocus = () => {
      try {
        const target = document.getElementById(opt.targetId) as HTMLElement;
        const style = window.getComputedStyle(target);
        const visibility = style?.getPropertyValue('visibility');
        if (visibility === 'hidden') target.style.visibility = 'visible'; // unhide the input
        target.focus({ preventScroll }); // focus on it so keyboard pops
        if (visibility === 'hidden') target.style.visibility = 'hidden'; // hide it again
        callback();
      } catch (error) {
        console.error(
          'useMobileKeyboardOpener: failed to focus target element',
          error,
        );
      }
    };
    const handler = (e: Event) => {
      if (enabled(e)) inputFocus();
    };

    if (focusOnInit) inputFocus();
    if (!!helperId) {
      document.getElementById(helperId)?.addEventListener(event, handler);

      return () => {
        document.getElementById(helperId)?.removeEventListener(event, handler);
      };
    }
  }, [opt]);

  return setOptions;
};

export default useMobileKeyboardOpener;
