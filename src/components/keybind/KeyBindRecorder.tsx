import { SetStoreFunction, Store, unwrap } from "solid-js/store";
import { HotKey, KeyBind } from "~/gen/bindings";
import removeAccents from "remove-accents";
import { createSignal, onCleanup, onMount, Show } from "solid-js";
import DisplayKeyBind from "~/components/keybind/DisplayKeyBind";
import { uid } from "~/util/uid";
import isEqual from "lodash-es/isEqual";
import { useSettings } from "~/util/settings";

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

export function createKeyBindRecorder(
  keyBind: Store<KeyBind>,
  setKeyBind: SetStoreFunction<KeyBind>,
  id: number,
) {
  const [settings] = useSettings();

  const [isUnique, setUnique] = createSignal(false);
  const checkUniqueness = () => {
    for (const hotkey of settings.hotkeys) {
      if (hotkey.id == id) {
        continue;
      }
      if (isEqual(unwrap(hotkey.keybind), unwrap(keyBind))) {
        return false;
      }
    }
    return true;
  };

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
    const unique = checkUniqueness();
    setUnique(unique);
    console.log("Is unique:", unique);
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
        setKeyBind(empty);
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
    {
      isUnique,
      KeyBindRecorder: () =>
        <>
          <DebugDebounce lastTimestamp={() => lastTimestamp} />
          <DisplayKeyBind keyBind={keyBind} onEmpty={
            <span class={"text-muted-foreground"}>Recording...</span>
          } />
        </>,
    }
  );
}
