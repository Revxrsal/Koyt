import { Button } from "~/components/ui/button";
import { createSignal, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";

interface KeyBind {
  lShift: boolean;
  rShift: boolean;
  ctrl: boolean;
  alt: boolean;
  command: boolean;
  tab: boolean;
  key: string;
}

function createEmptyKeyBind(): KeyBind {
  return { alt: false, command: false, ctrl: false, key: "", lShift: false, rShift: false, tab: false };
}

export default function Index() {
  const [keyBind, setKeyBind] = createStore(createEmptyKeyBind());
  const [isRecording, setRecording] = createSignal(false);
  const [lastKey, setLastKey] = createSignal<KeyboardEvent | null>(null);
  onMount(() => {
    document.addEventListener("keydown", event => {
      if (isRecording()) {
        setKeyBind("alt", event.altKey);
        setLastKey(event);
      }
    });
  });
  return (
    <main class={"min-h-screen flex flex-col p-4 justify-center items-center"}>
      <Show when={lastKey()}>
        {JSON.stringify(lastKey(), null, 2)}
      </Show>
      <h1>
        Hello
      </h1>
      <Button size={"lg"} class={"my-4"} onClick={() => setRecording(v => !v)}>
        {isRecording() ? <span class={"text-red-800"}>Recording</span> : "Record"}
      </Button>
    </main>
  );
}
