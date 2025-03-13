import hotkeys, {KeyHandler} from "hotkeys-js";
import {onCleanup, onMount} from "solid-js";

export function createKeyBind(key: string, handler: KeyHandler) {
  onMount(() => hotkeys(key, handler))
  onCleanup(() => hotkeys.unbind(key))
}
