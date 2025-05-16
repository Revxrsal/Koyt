import { createSignal, For } from "solid-js";
import { CommandMenu } from "~/components/CommandMenu";
import DisplayKeyBind from "~/components/keybind/DisplayKeyBind";
import { createStore, Store, unwrap } from "solid-js/store";
import KeyBindDialog from "~/components/keybind/KeyBindDialog";
import { commands, HotKey, KeyBind } from "~/gen/bindings";
import { useSettings } from "~/util/settings";
import { Button } from "~/components/ui/button";
import VideoActionPicker from "~/components/action/VideoActionPicker";
import { AiTwotoneDelete } from "solid-icons/ai";
import { isRegistered, unregister } from "@tauri-apps/plugin-global-shortcut";
import { createEmptyHotKey } from "~/components/keybind/KeyBindRecorder";

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

function DisplayHotKey(props: {
  hotkey: Store<HotKey>;
  index: number;
}) {
  const [_settings, setSettings] = useSettings();
  const [showKbDialog, setShowKbDialog] = createSignal(false);
  const [_keyBind, setKeyBind] = createStore(props.hotkey.keybind);

  function deleteHotKey() {
    setSettings("hotkeys", (keys) => {
      const newKeys = [...keys];
      newKeys.splice(props.index, 1);
      return newKeys;
    });
  }

  return (
    <div class={"grid grid-cols-8 gap-4 w-full align-middle my-2 place-items-stretch justify-between"}>
      <Button size={"icon"} class={"align-middle place-content-center my-auto"} onClick={async () => {
        deleteHotKey();
        await unregister(await commands.toTauriGlobalShortcut(props.hotkey.keybind));
      }}>
        <AiTwotoneDelete size={20} />
      </Button>
      <DisplayKeyBind keyBind={props.hotkey.keybind} />
      <div class={"mx-8"} />
      <KeyBindDialog
        show={showKbDialog()}
        setShow={setShowKbDialog}
        keyBind={props.hotkey.keybind}
        setKeyBind={setKeyBind}
        reload={(oldKeyBind, newKeyBind) => reload(oldKeyBind, newKeyBind, structuredClone(unwrap(props.hotkey)))}
      />
      <div class={"mx-8"} />
      <VideoActionPicker hotkey={props.hotkey} />
    </div>
  );
}

export default function Index() {
  const [settings, setSettings] = useSettings();
  return (
    <main class={"min-h-screen flex flex-col p-4"}>
      <h1 class={"me-8 ms-2 my-8"}>
        KeyBinds
      </h1>
      <For each={settings.hotkeys}>{(hotkey, index) => (
        <DisplayHotKey hotkey={hotkey} index={index()} />
      )}</For>
      <Button size={"lg"} class={"w-fit my-4"} onClick={async () => {
        const newHotkey = createEmptyHotKey();
        setSettings("hotkeys", v => [...v, newHotkey]);
      }}>
        Define new key
      </Button>
    </main>
  );
}
