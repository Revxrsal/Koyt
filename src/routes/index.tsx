import { Button } from "~/components/ui/button";
import { Component, ComponentProps, createSignal, For, onMount, Show, splitProps } from "solid-js";
import { createStore } from "solid-js/store";
import { UserOS } from "~/util/os";
import { BsCommand } from "solid-icons/bs";
import removeAccents from "remove-accents";
import { CommandMenu } from "~/components/CommandMenu";
import { cn } from "~/libs/cn";
import { SiWindows11 } from "solid-icons/si";

const FUNCTION_KEYS = ["Control", "Alt", "Meta", "Shift"];


function DisplayKeyBind(props: { keyBind: KeyBind }) {

  const components: () => Component[] = () => {
    let array: Component[] = [];

    if (props.keyBind.meta) {
      if (UserOS == "Windows")
        // array.push(() => <Kbd><BsCommand size={20} /></Kbd>);
        array.push(() => <Kbd><SiWindows11 size={20} /></Kbd>);
      else if (UserOS == "Linux")
        array.push(() => <Kbd><BsCommand size={20} /></Kbd>);
      else if (UserOS == "MacOS")
        array.push(() => <Kbd><BsCommand size={20} /></Kbd>);
    }
    if (props.keyBind.ctrl) {
      array.push(() => <Kbd>Ctrl</Kbd>);
    }
    if (props.keyBind.alt) {
      array.push(() => <Kbd>Alt</Kbd>);
    }
    if (props.keyBind.shift) {
      array.push(() => <Kbd>Shift</Kbd>);
    }
    if (props.keyBind.key && !FUNCTION_KEYS.includes(props.keyBind.key)) {
      if (props.keyBind.key == " ")
        array.push(() => <Kbd>Space</Kbd>);
      else
        array.push(() => <Kbd>{props.keyBind.key}</Kbd>);
    }
    return array;
  };

  return (
    <div class={"flex flex-row items-center justify-center"}>
      <For each={components()}>{(keystroke, i) =>
        (
          <>
            <Show when={i() != 0}>
              <span class={"select-none"}>{" + "}</span>
            </Show>
            {keystroke({})}
          </>
        )}
      </For>
    </div>
  );
}



export default function Index() {
  const [keyBind, setKeyBind] = createStore(createEmptyKeyBind());
  const [isRecording, setRecording] = createSignal(false);
  let lastTimestamp = 0;

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
    document.addEventListener("keydown", event => {
      if (isRecording()) {
        console.log(event);
        event.preventDefault();

        const now = Date.now(); // Current timestamp in milliseconds

        const twoSecondsHavePassed = (now - lastTimestamp >= DEBOUNCE_TIME);
        if (twoSecondsHavePassed) {
          const empty = createEmptyKeyBind();
          // batch(() => {
          setKeyBind(empty);
          updateFromEvent(event);
          // })
        } else {
          updateFromEvent(event);
        }
        lastTimestamp = now;

        // console.log(event);
        // setKeyBind("alt", event.altKey);
        // setKeyBind("ctrl", event.ctrlKey);
        // setKeyBind("shift", event.shiftKey);
        // setKeyBind("command", event.key == "Meta");
        // if (!EXCLUDED_MODIFIERS.includes(event.key)) {
        //   setKeyBind("key", event.key);
        // }

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
      <CommandMenu />
    </main>
  );
}
