import {onCleanup, onMount} from "solid-js";
import hotkeys, {KeyHandler} from "hotkeys-js";
import {events, OxideHotKey} from "~/gen/bindings";
import {UnlistenFn} from "@tauri-apps/api/event";

export function addKeyboardListener(key: string, button: () => (HTMLButtonElement | undefined)) {

  function onKeyboardEvent(event: KeyboardEvent) {
    if (event.key == key) {
      button?.()?.click()
    }
  }

  onMount(() => document.addEventListener("keydown", onKeyboardEvent))
  onCleanup(() => document.removeEventListener("keydown", onKeyboardEvent))
}

export function addEnterListener(button: () => (HTMLButtonElement | undefined)) {
  addKeyboardListener("Enter", button)
}

export function createKeyBind(key: string, handler: KeyHandler) {
  onMount(() => hotkeys(key, handler))
  onCleanup(() => hotkeys.unbind(key))
}

export function createHardwareKeyboardListener(hotKey: OxideHotKey, handler: () => void) {
  let unlisten: UnlistenFn | undefined
  onMount(async () => {
    await events.hardwareHotkeyEvent.listen(({payload}) => {
      if (payload.hotkey == hotKey) {
        handler()
      }
    })
  })
  onCleanup(() => unlisten?.())
}
