import { useEditKeyBind } from "~/components/keybind/EditKeyBindContextProvider";
import removeAccents from "remove-accents";
import { createEmptyKeyBind, isFunctionKey } from "~/util/keyboard";
import { createEventListener } from "~/hooks/createEventListener";
import { createReactiveDebouncer } from "~/hooks/createReactiveDebouncer";
import { Show } from "solid-js";
import DisplayKeyBind from "~/components/keybind/DisplayKeyBind";

export default function KeyBindEditor() {
  const [keyBind, setKeyBind] = useEditKeyBind();
  const { debounce, timeUntilReset, hasPassed } = createReactiveDebouncer(2000);

  function updateFromEvent(event: KeyboardEvent) {
    if (event.ctrlKey)
      setKeyBind("ctrl", true);
    if (event.altKey)
      setKeyBind("alt", true);
    if (event.shiftKey)
      setKeyBind("shift", true);
    if (event.metaKey)
      setKeyBind("meta", true);

    if (!isFunctionKey(event.key))
      setKeyBind("key", removeAccents(event.key).toUpperCase());
  }

  createEventListener("keydown", event => {
    event.preventDefault();
    debounce();

    if (hasPassed()) {
      const empty = createEmptyKeyBind();
      setKeyBind(empty);
      updateFromEvent(event);
    } else {
      updateFromEvent(event);
    }
  });

  return (
    <>
      <Show when={timeUntilReset() > 0} fallback={
        <p>Composing a new key</p>
      }>
        <p>Composing. Keep typing. Wait {(timeUntilReset() / 1000).toFixed(2)}s to reset</p>
      </Show>
      <DisplayKeyBind keyBind={keyBind} onEmpty={
        <span class={"text-muted-foreground"}>Recording...</span>
      } />
    </>
  );
}
