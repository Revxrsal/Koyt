import { commands, HotKey, KeyBind } from "~/gen/bindings";
import { useSettings } from "~/util/settings";
import { showErrorToast, showSuccessToast } from "~/util/toaster";
import { isRegistered, unregister } from "@tauri-apps/plugin-global-shortcut";
import { toGlobalShortcut } from "~/util/keyboard";
import { unwrap } from "solid-js/store";
import { toaster } from "@kobalte/core";
import { Toast, ToastContent, ToastProgress, ToastTitle } from "~/components/ui/toast";
import { Button } from "~/components/ui/button";
import { uid } from "~/util/uid";

export function createKeyBindController(id: number) {
  const [settings, setSettings] = useSettings();

  async function update(newKeyBind: KeyBind) {
    const oldKeyBind = unwrap(settings.hotkeys.find(hk => hk.id !== id)?.keybind);
    const index = settings.hotkeys.findIndex(h => h.id === id);
    if (index == -1)
      return;
    try {
      if (oldKeyBind)
        await reload(oldKeyBind, newKeyBind, settings.hotkeys[index]);
      setSettings("hotkeys", index, "keybind", newKeyBind);
      showSuccessToast("Success!", "Successfully updated keybind");
    } catch (e) {
      showErrorToast("Error!", `Failed to update keybind: ${e}`);
    }
  }

  function deleteFromSettings() {
    setSettings("hotkeys", h => h.filter(hk => hk.id !== id));
  }

  async function deleteHotKey() {
    const hotkey = settings.hotkeys.find(hk => hk.id === id);
    if (!hotkey)
      return;
    const shortcut = await toGlobalShortcut(hotkey.keybind);
    if (!shortcut) {
      return;
    }
    try {
      await unregister(shortcut);
      setSettings("hotkeys", h => h.filter(hk => hk.id !== id));
      showSuccessToast("Success!", "Successfully deleted keybind");
    } catch (e) {
      toaster.show(props => (
        <Toast toastId={props.toastId} variant={"destructive"}>
          <ToastContent>
            <ToastTitle>Error!</ToastTitle>
            <p>Failed to unregister keybind from the system. Please restart the app to fully unregister</p>
            <Button class={"mt-4"} onClick={() => {
              deleteFromSettings();
              toaster.dismiss(props.toastId);
            }} size={"sm"}>
              Delete anyway
            </Button>
          </ToastContent>
          <ToastProgress />
        </Toast>
      ));
    }

  }

  return {
    updateHotKey: update,
    deleteHotKey,
  };
}

async function reload(oldKeyBind: KeyBind, newKeyBind: KeyBind, hotkey: HotKey) {
  const oldShortcut = await toGlobalShortcut(oldKeyBind);
  if (oldShortcut && await isRegistered(oldShortcut)) {
    await unregister(oldShortcut);
  }
  const shortcut = await commands.toTauriGlobalShortcut(newKeyBind);
  if (shortcut) {
    await commands.registerKeybindToSystem(hotkey);
  }
}

export function createHotKeyCreator() {
  const [_, setSettings] = useSettings();

  return {
    createHotKey: async (keyBind: KeyBind) => {
      const hotkey: HotKey = {
        id: uid(),
        keybind: keyBind,
        video_action: { Playing: "Toggle" },
      };

      const shortcut = await toGlobalShortcut(keyBind);
      if (shortcut) {
        const result = await commands.registerKeybindToSystem(hotkey);
        if (result.status === "error") {
          showErrorToast("Error!", result.error);
        } else {
          showSuccessToast("Success!", "Successfully registered keybind");
          setSettings("hotkeys", v => [...v, hotkey]);
        }
      }
    },
  };
}
