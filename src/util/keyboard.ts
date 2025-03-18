import {onCleanup, onMount} from "solid-js";

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
