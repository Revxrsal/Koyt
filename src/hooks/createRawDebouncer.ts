import { createSignal } from "solid-js";

export interface Debouncer {
  timeUntilReset: () => number,
  debounce: () => void,
  hasPassed: () => boolean
}

export function createRawDebouncer(debounceTime: number): Debouncer {
  const [lastTimestamp, setLastTimestamp] = createSignal(0);
  return {
    timeUntilReset: () => {
      const now = Date.now();
      const elapsed = Math.min(now - lastTimestamp(), debounceTime);
      return debounceTime - elapsed;
    },
    debounce: () => {
      setLastTimestamp(Date.now());
    },
    hasPassed: () => {
      const now = Date.now();
      return (now - lastTimestamp() >= debounceTime);
    },
  };
}
