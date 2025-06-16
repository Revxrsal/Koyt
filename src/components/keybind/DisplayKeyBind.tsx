import { Component, ComponentProps, For, JSXElement, Show, splitProps } from "solid-js";
import { UserOS } from "~/util/os";
import { SiWindows11 } from "solid-icons/si";
import { BsCommand } from "solid-icons/bs";
import { KeyBind } from "~/gen/bindings";
import Kbd from "~/components/keybind/Kbd";
import { cn } from "~/libs/cn";
import { isFunctionKey } from "~/util/keyboard";

export interface DisplayKeyBindProps extends ComponentProps<"div"> {
  keyBind: KeyBind,
  onEmpty?: JSXElement,
}

export default function DisplayKeyBind(props: DisplayKeyBindProps) {
  const [local, divProps] = splitProps(props, ["class", "keyBind", "onEmpty"]);

  const components: () => Component[] = () => {
    let array: Component[] = [];

    if (local.keyBind.meta) {
      if (UserOS == "Windows")
        array.push(() => <Kbd><SiWindows11 size={20} /></Kbd>);
      else if (UserOS == "Linux")
        array.push(() => <Kbd><BsCommand size={20} /></Kbd>);
      else if (UserOS == "MacOS")
        array.push(() => <Kbd><BsCommand size={20} /></Kbd>);
    }
    if (local.keyBind.ctrl) {
      array.push(() => <Kbd>Ctrl</Kbd>);
    }
    if (local.keyBind.alt) {
      array.push(() => <Kbd>Alt</Kbd>);
    }
    if (local.keyBind.shift) {
      array.push(() => <Kbd>Shift</Kbd>);
    }
    if (local.keyBind.key && !isFunctionKey(local.keyBind.key)) {
      if (local.keyBind.key == " ")
        array.push(() => <Kbd>Space</Kbd>);
      else
        array.push(() => <Kbd>{local.keyBind.key}</Kbd>);
    }
    return array;
  };

  return (
    <div class={cn("flex flex-row items-center", local.class)} {...divProps}>
      <Show when={local.onEmpty && components().length == 0}>
        {local.onEmpty}
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
