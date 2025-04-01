import { SetStoreFunction, Store } from "solid-js/store";
import { HotKey, KeyBind } from "~/gen/bindings";
import removeAccents from "remove-accents";
import { createSignal, onCleanup, onMount, Show } from "solid-js";
import DisplayKeyBind from "~/components/keybind/DisplayKeyBind";
import { uid } from "~/util/uid";

export const FUNCTION_KEYS = ["Control", "Alt", "Meta", "Shift"];
const DEBOUNCE_TIME = 2000;

export function createEmptyKeyBind(): KeyBind {
  return { alt: false, meta: false, ctrl: false, key: "", shift: false };
}

export function createSampleKeyBind(): KeyBind {
  return { alt: false, meta: false, ctrl: true, key: "C", shift: true };
}

export function createEmptyHotKey(): HotKey {
  return { id: uid(), keybind: createEmptyKeyBind(), video_action: { Playing: "Toggle" } };
}

function DebugDebounce(props: { lastTimestamp: () => number }) {
  const [debouncing, setDebouncing] = createSignal(0);
  let interval: any;
  onMount(() => {
    interval = setInterval(() => {
      const now = Date.now(); // Current timestamp in milliseconds
      const elapsed = Math.min(now - props.lastTimestamp(), DEBOUNCE_TIME);
      setDebouncing(DEBOUNCE_TIME - elapsed);
    }, 50);
  });
  onCleanup(() => clearInterval(interval));
  return (
    <>
      <Show when={debouncing() > 0} fallback={
        <p>Composing a new key</p>
      }>
        <p>Composing. Keep typing. Wait {(debouncing() / 1000).toFixed(2)}s to reset</p>
      </Show>
    </>
  );
}

export default function KeyBindRecorder(props: {
  keyBind: Store<KeyBind>,
  setKeyBind: SetStoreFunction<KeyBind>,
}) {
  function updateFromEvent(event: KeyboardEvent) {
    if (event.ctrlKey)
      props.setKeyBind("ctrl", true);
    if (event.altKey)
      props.setKeyBind("alt", true);
    if (event.shiftKey)
      props.setKeyBind("shift", true);
    if (event.metaKey)
      props.setKeyBind("meta", true);

    if (!FUNCTION_KEYS.includes(event.key))
      props.setKeyBind("key", removeAccents(event.key).toUpperCase());
  }

  let lastTimestamp = 0;

  let listener: (event: KeyboardEvent) => void;

  onMount(() => {
    listener = (event: KeyboardEvent) => {
      event.preventDefault();

      const now = Date.now(); // Current timestamp in milliseconds

      const shouldReset = (now - lastTimestamp >= DEBOUNCE_TIME);
      if (shouldReset) {
        const empty = createEmptyKeyBind();
        props.setKeyBind(empty);
        updateFromEvent(event);
      } else {
        updateFromEvent(event);
      }
      lastTimestamp = now;
    };

    document.addEventListener("keydown", listener);
  });
  onCleanup(() => document.removeEventListener("keydown", listener));
  return (
    <>
      <DebugDebounce lastTimestamp={() => lastTimestamp} />
      <DisplayKeyBind keyBind={props.keyBind} onEmpty={
        <span class={"text-muted-foreground"}>Recording...</span>
      } />
    </>
  );
}
