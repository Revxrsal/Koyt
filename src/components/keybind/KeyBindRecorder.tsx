import { createStore } from "solid-js/store";
import { KeyBind } from "~/gen/bindings";
import removeAccents from "remove-accents";
import { onMount } from "solid-js";

const FUNCTION_KEYS = ["Control", "Alt", "Meta", "Shift"];
const DEBOUNCE_TIME = 1670;

function createEmptyKeyBind(): KeyBind {
  return { alt: false, meta: false, ctrl: false, key: "", shift: false };
}

export default function KeyBindRecorder(props: {
  keyBind: KeyBind,
  setKeyBind: (keyBind: KeyBind) => void,
}) {
  const [keyBind, setKeyBind] = createStore(structuredClone(props.keyBind));

  function updateFromEvent(event: KeyboardEvent) {
    if (event.ctrlKey)
      setKeyBind("ctrl", true);
    if (event.altKey)
      setKeyBind("alt", true);
    if (event.shiftKey)
      setKeyBind("shift", true);
    if (event.metaKey)
      setKeyBind("meta", true);

    if (!FUNCTION_KEYS.includes(event.key))
      setKeyBind("key", removeAccents(event.key).toUpperCase());
  }

  onMount(() => {
    let lastTimestamp = 0;
    document.addEventListener("keydown", event => {
      console.log(event);
      event.preventDefault();

      const now = Date.now(); // Current timestamp in milliseconds

      const shouldReset = (now - lastTimestamp >= DEBOUNCE_TIME);
      if (shouldReset) {
        const empty = createEmptyKeyBind();
        // batch(() => {
        setKeyBind(empty);
        updateFromEvent(event);
        // })
      } else {
        updateFromEvent(event);
      }
      lastTimestamp = now;
    });
  });
}
