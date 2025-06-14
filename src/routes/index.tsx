import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { createStore, Store, unwrap } from "solid-js/store";
import { commands, HotKey, KeyBind } from "~/gen/bindings";
import { useSettings } from "~/util/settings";
import { Button } from "~/components/ui/button";
import { isRegistered, unregister } from "@tauri-apps/plugin-global-shortcut";
import { Card } from "~/components/ui/card";
import DisplayKeyBind from "~/components/keybind/DisplayKeyBind";
import KeyBindDialog from "~/components/keybind/KeyBindDialog";
import VideoActionPicker from "~/components/action/VideoActionPicker";
import { AiTwotoneDelete } from "solid-icons/ai";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { DialogTriggerProps } from "@kobalte/core/dialog";
import { createEmptyHotKey } from "~/components/keybind/KeyBindRecorder";
import { VsExtensions, VsSettings } from "solid-icons/vs";
import { useNavigate } from "@solidjs/router";

async function reload(oldKeyBind: KeyBind, newKeyBind: KeyBind, hotkey: HotKey) {
  const oldShortcut = await commands.toTauriGlobalShortcut(oldKeyBind);
  if (oldShortcut && await isRegistered(oldShortcut)) {
    await unregister(oldShortcut);
    console.log("Unregistered old global shortcut");
  }
  const shortcut = await commands.toTauriGlobalShortcut(newKeyBind);
  if (shortcut) {
    await commands.registerKeybindToSystem(hotkey);
  }
}

function DeleteButton(props: { delete: () => void }) {
  const [show, setShow] = createSignal(false);
  let shiftKey: boolean = false;

  function onKeyboardEvent(event: KeyboardEvent) {
    if (!event.repeat)
      shiftKey = event.shiftKey;
  }

  onMount(() => {
    document.addEventListener("keydown", onKeyboardEvent);
    document.addEventListener("keyup", onKeyboardEvent);
  });
  onCleanup(() => {
    document.removeEventListener("keydown", onKeyboardEvent);
    document.removeEventListener("keyup", onKeyboardEvent);
  });
  return (
    <>
      <Dialog open={show()} onOpenChange={setShow}>
        <DialogTrigger
          as={(triggerProps: DialogTriggerProps) => {
            const triggerClick = triggerProps?.onClick;
            return <Button size={"icon"} variant={"destructive"} {...triggerProps} onClick={(ev: any) => {
              if (shiftKey) {
                props.delete();
              } else {
                // @ts-ignore
                triggerClick?.(ev);
              }
            }}>
              <AiTwotoneDelete size={24} />
            </Button>;
          }
          } />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure?
            </DialogTitle>

            <div class={"py-2"}>
              <p>Are you sure you want to delete this hotkey?</p>
              <sub><strong>Note</strong>: You can hold shift to prevent this modal from appearing.</sub>
            </div>
            <DialogFooter class={"flex"}>
              <Button
                onClick={() => setShow(false)}
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={async () => {
                  setShow(false);
                  props.delete();
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DisplayHotKey(props: {
  hotkey: Store<HotKey>;
  index: number;
}) {
  const [_settings, setSettings] = useSettings();
  const [showKbDialog, setShowKbDialog] = createSignal(false);
  const [_keyBind, setKeyBind] = createStore(props.hotkey.keybind);

  async function deleteHotKey() {
    setSettings("hotkeys", (keys) => {
      const newKeys = [...keys];
      newKeys.splice(props.index, 1);
      return newKeys;
    });
    await unregister(await commands.toTauriGlobalShortcut(props.hotkey.keybind));
  }

  return (
    <Card class={"my-4 p-8 relative"}>
      <DeleteButton delete={deleteHotKey} />
      <div class="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <h3>Hot Key</h3>
        <DisplayKeyBind keyBind={props.hotkey.keybind} onEmpty={"No keybind set"} />
        <KeyBindDialog
          id={props.hotkey.id}
          class={`hotkey-${props.hotkey.id}`}
          show={showKbDialog()}
          setShow={setShowKbDialog}
          keyBind={props.hotkey.keybind}
          setKeyBind={setKeyBind}
          reload={(oldKeyBind, newKeyBind) => reload(oldKeyBind, newKeyBind, structuredClone(unwrap(props.hotkey)))}
        />
      </div>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <h3 class={"me-4"}>Action</h3>
        <VideoActionPicker hotkey={props.hotkey} />
      </div>
    </Card>
  );
}

async function openChromeExtension() {
  await commands.openUrl("https://chromewebstore.google.com/detail/hdffofcnfjaehdacnbhccnhnomaihcok");
}

export default function Index() {
  const [settings, setSettings] = useSettings();
  const navigate = useNavigate();

  async function defineHotKey() {
    const newHotkey = createEmptyHotKey();
    setSettings("hotkeys", v => [...v, newHotkey]);
    setTimeout(() => {
      const hotkeyButton = document.getElementsByClassName(`hotkey-${newHotkey.id}`);
      if (hotkeyButton && hotkeyButton[0]) {
        (hotkeyButton[0] as HTMLButtonElement).click();
      }
    }, 50)
  }

  return (
    <main class={`min-h-screen flex flex-col p-4`}>
      <div>
        <Button class={"me-4"} onClick={() => navigate("/settings")}>
          <VsSettings size={23} />
          <p class={"ms-4"}>Settings</p>
        </Button>
        <Button onClick={openChromeExtension}>
          <VsExtensions size={20} />
          <p class={"ms-4"}>Get Chrome Extension</p>
        </Button>
      </div>
      <h1 class={"me-8 ms-2 my-8"}>
        KeyBinds
      </h1>
      <Show when={settings.hotkeys.length > 0} fallback={
        <div class={"flex flex-col justify-center items-center"}>
          <h2 class={"my-4"}>No hotkeys set!</h2>
          <Button size={"lg"} onClick={defineHotKey}>
            Create a new hotkey
          </Button>
        </div>
      }>
        <Button size={"lg"} class={"w-fit my-4"} onClick={defineHotKey}>
          Define new key
        </Button>
        <For each={settings.hotkeys}>{(hotkey, index) => (
          <DisplayHotKey hotkey={hotkey} index={index()} />
        )}
        </For>
      </Show>
    </main>
  );
}
