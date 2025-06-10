import { Component, For, JSXElement, Show } from "solid-js";
import { UserOS } from "~/util/os";
import { SiWindows11 } from "solid-icons/si";
import { BsCommand } from "solid-icons/bs";
import { KeyBind } from "~/gen/bindings";
import Kbd from "~/components/keybind/Kbd";
import { FUNCTION_KEYS } from "~/components/keybind/KeyBindRecorder";
import { cn } from "~/libs/cn";

export default function DisplayKeyBind(props: { keyBind: KeyBind, onEmpty?: JSXElement, class?: string }) {

  const components: () => Component[] = () => {
    let array: Component[] = [];

    if (props.keyBind.meta) {
      if (UserOS == "Windows")
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
    <div class={cn("flex flex-row items-center", props.class)}>
      <Show when={props.onEmpty && components().length == 0}>
        {props.onEmpty}
      </Show>
      <For each={components()}>{(keystroke, i) =>
        (
          <>
            <Show when={i() != 0}>
              <span class={"select-none mx-4"}>{" + "}</span>
            </Show>
            {keystroke({})}
          </>
        )}
      </For>
    </div>
  );
}
