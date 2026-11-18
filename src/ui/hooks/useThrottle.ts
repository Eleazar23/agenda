import { useRef, useCallback } from 'react';

export function useThrottle<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number = 500,
): (...args: Args) => void {
  const lastCall = useRef<number>(0);

  return useCallback((...args: Args) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  }, [callback, delay]);
}
