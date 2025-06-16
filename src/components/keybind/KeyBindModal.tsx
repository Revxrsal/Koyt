import { createMemo, createSignal, Show } from "solid-js";
import { KeyBind } from "~/gen/bindings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import { createStore, unwrap } from "solid-js/store";
import { createEmptyKeyBind, isKeyBindEmpty } from "~/util/keyboard";
import EditKeyBindContextProvider from "~/components/keybind/EditKeyBindContextProvider";
import KeyBindEditor from "~/components/keybind/KeyBindEditor";
import { useSettings } from "~/util/settings";
import { isEqual } from "lodash-es";
import { trackDeep } from "~/deep";

export function createKeyBindDialog(id?: number) {
  const [open, setOpen] = createSignal(false);
  return {
    KeyBindDialog: (props: {
      initialKeyBind?: KeyBind,
      onKeyBindUpdated: (keyBind: KeyBind) => void
    }) => (
      <AlertDialog open={open()} onOpenChange={setOpen}>
        <Show when={open()}>
          <HotKeyModalContent
            id={id}
            initial={props.initialKeyBind}
            onConfirm={props.onKeyBindUpdated}
          />
        </Show>
      </AlertDialog>
    ),
    openKeyBindDialog: () => setOpen(true),
  };
}

function HotKeyModalContent(props: {
  id?: number,
  initial?: KeyBind
  onConfirm: (keyBind: KeyBind) => void
}) {
  const [keyBind, setKeyBind] = createStore(
    props.initial ? structuredClone(unwrap(props.initial)) : createEmptyKeyBind(),
  );
  const [settings] = useSettings();

  const isDuplicate = createMemo(() => {
    trackDeep(keyBind);
    for (const hotkey of settings.hotkeys) {
      if (hotkey.id === props.id) {
        continue;
      }
      if (isEqual(unwrap(hotkey.keybind), unwrap(keyBind))) {
        return true;
      }
    }
    return false;
  });

  const isEmpty = createMemo(() => {
    trackDeep(keyBind);
    return isKeyBindEmpty(keyBind);
  });

  return (
    <>
      <AlertDialogContent class={"select-none"}>
        <AlertDialogHeader>
          <h3>Set hotkey</h3>
        </AlertDialogHeader>
        <EditKeyBindContextProvider keyBind={[keyBind, setKeyBind]}>
          <KeyBindEditor />
        </EditKeyBindContextProvider>
        <Show when={isDuplicate()}>
          <span class="text-red-400">Duplicated hotkey!</span>
        </Show>
        <AlertDialogFooter>
          <AlertDialogClose class={"select-none"}>
            Cancel
          </AlertDialogClose>
          <AlertDialogAction
            disabled={isDuplicate() || isEmpty()}
            onClick={() => props.onConfirm(structuredClone(unwrap(keyBind)))}
            class={"select-none"}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </>
  );
}
