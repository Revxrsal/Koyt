import { onCleanup, onMount } from "solid-js";

export function createInterval(handler: TimerHandler, timeout?: number) {
  onMount(() => {
    const interval = setInterval(handler, timeout, arguments);
    onCleanup(() => clearInterval(interval));
  });
}
