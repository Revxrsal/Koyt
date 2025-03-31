import { Button } from "~/components/ui/button";
import { Component, createSignal, For, JSXElement, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { UserOS } from "~/util/os";
import { SiWindows11 } from "solid-icons/si";
import { BsCommand } from "solid-icons/bs";

const EXCLUDED_MODIFIERS = ["Control", "Alt", "Meta", "Shift"];

interface KeyBind {
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
  command: boolean;
  key: string;
}

function DisplayKeyBind(props: { keyBind: KeyBind }) {

  const components: () => Component[] = () => {
    let array: Component[] = [];

    if (props.keyBind.command) {
      if (UserOS == "Windows")
        array.push(() => <BsCommand size={16} />);
        // array.push(() => <SiWindows11 size={16} />);
      else if (UserOS == "Linux")
        array.push(() => <SiWindows11 size={16} />);
      else if (UserOS == "MacOS")
        array.push(() => <BsCommand size={16} />);
    }
    if (props.keyBind.ctrl) {
      array.push(() => "Ctrl");
    }
    if (props.keyBind.alt) {
      array.push(() => "Alt");
    }
    if (props.keyBind.shift) {
      array.push(() => "Shift");
    }
    if (props.keyBind.key && !EXCLUDED_MODIFIERS.includes(props.keyBind.key)) {
      array.push(() => props.keyBind.key);
    }
    return array;
  };

  return (
    <div class={"flex flex-row items-center justify-center"}>
      <For each={components()}>{(keystroke, i) =>
        (
          <>
            <Show when={i() != 0}>
              <span>{" + "}</span>
            </Show>
            {keystroke({})}
          </>
        )}
      </For>
    </div>
  );
}

function createEmptyKeyBind(): KeyBind {
  return { alt: false, command: false, ctrl: false, key: "", shift: false };
}

export default function Index() {
  const [keyBind, setKeyBind] = createStore(createEmptyKeyBind());
  const [isRecording, setRecording] = createSignal(false);
  const [lastKey, setLastKey] = createSignal<KeyboardEvent | null>(null);
  onMount(() => {
    document.addEventListener("keydown", event => {
      if (isRecording()) {
        event.preventDefault();
        console.log(event);
        setKeyBind("alt", event.altKey);
        setKeyBind("ctrl", event.ctrlKey);
        setKeyBind("shift", event.shiftKey);
        setKeyBind("command", event.key == "Meta");
        if (!EXCLUDED_MODIFIERS.includes(event.key)) {
          setKeyBind("key", event.key);
        }
      }
    });
  });
  return (
    <main class={"min-h-screen flex flex-col p-4 justify-center items-center"}>
      <p class={"whitespace-pre-wrap"}>
        <DisplayKeyBind keyBind={keyBind} />
      </p>
      <h1>
        Hello
      </h1>
      <Button size={"lg"} class={"my-4"} onClick={() => setRecording(v => !v)}>
        {isRecording() ? <span class={"text-red-800"}>Recording</span> : "Record"}
      </Button>
    </main>
  );
}
