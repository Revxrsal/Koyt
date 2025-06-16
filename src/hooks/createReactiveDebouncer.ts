import { createRawDebouncer, Debouncer } from "~/hooks/createRawDebouncer";
import { createInterval } from "~/hooks/createInterval";
import { createSignal } from "solid-js";

export function createReactiveDebouncer(debounceTime: number, pollInterval: number = 50): Debouncer {
  const debouncer = createRawDebouncer(debounceTime);
  const [hasPassed, setHasPassed] = createSignal(debouncer.hasPassed());
  const [timeUntilReset, setTimeUntilReset] = createSignal(debouncer.timeUntilReset());
  createInterval(() => {
    setHasPassed(debouncer.hasPassed());
    setTimeUntilReset(debouncer.timeUntilReset());
  }, pollInterval);
  return {
    debounce: debouncer.debounce,
    hasPassed,
    timeUntilReset,
  };
}
