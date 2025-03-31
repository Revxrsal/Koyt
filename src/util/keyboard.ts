import { onCleanup, onMount } from "solid-js";
import hotkeys, { KeyHandler } from "hotkeys-js";

export function createKeyBind(key: string, handler: KeyHandler) {
  onMount(() => hotkeys(key, handler));
  onCleanup(() => hotkeys.unbind(key));
}
