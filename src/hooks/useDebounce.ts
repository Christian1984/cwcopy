import { useRef, useCallback } from 'react';

/**
 * Returns stable `trigger` and `cancel` functions.
 *
 * Calling `trigger()` resets the internal timer; `callback` fires only after
 * `delay` ms have elapsed with no further `trigger()` calls.
 */
export function useDebounce(callback: () => void, delay: number) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Keep a ref to the latest callback so we don't need it in the deps array.
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const trigger = useCallback(() => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      callbackRef.current();
    }, delay);
  }, [delay]);

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { trigger, cancel };
}
