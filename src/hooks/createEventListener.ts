import { onCleanup, onMount } from "solid-js";

export function createEventListener<K extends keyof DocumentEventMap>(
  type: K,
  listener: (this: Document, ev: DocumentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): void {
  onMount(() => {
    document.addEventListener(type, listener, options);
    onCleanup(() => document.removeEventListener(type, listener));
  });
}
