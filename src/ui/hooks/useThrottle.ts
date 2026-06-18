import { useRef, useCallback } from 'react';

interface ThrottleOptions {
  delay?: number;
}

interface ThrottleCallback {
  (...args: any[]): void;
}

export function useThrottle(callback: ThrottleCallback, delay: number = 500): (...args: any[]) => void {
  const lastCall = useRef<number>(0);

  return useCallback((...args: any[]) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  }, [callback, delay]);
}
