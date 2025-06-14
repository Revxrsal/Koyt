import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { DialogTriggerProps } from "@kobalte/core/dialog";
import { Button } from "~/components/ui/button";
import { KeyBind } from "~/gen/bindings";
import { createStore, unwrap } from "solid-js/store";
import { createKeyBindRecorder } from "~/components/keybind/KeyBindRecorder";
import { Show } from "solid-js";

function KeyBindDialogContent(props: {
  keyBind: KeyBind,
  setKeyBind: (keyBind: KeyBind) => void,
  show: boolean,
  onCancel: () => void,
  setShow: (show: boolean) => void,
  reload: (oldKeyBind: KeyBind, newKeyBind: KeyBind) => void,
  id: number
}) {
  const [keyBind, setKeyBind] = createStore(structuredClone(unwrap(props.keyBind)));
  const { KeyBindRecorder, isUnique } = createKeyBindRecorder(keyBind, setKeyBind, props.id);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Change key bind
        </DialogTitle>

        <KeyBindRecorder />
        <Show when={!isUnique()}>
          <p class={"text-red-400"}>
            Duplicate key
          </p>
        </Show>
        <DialogFooter class={"select-none"}>
          <Button
            onClick={() => {
              props.setShow(false);
              props.onCancel();
            }}
            variant={"outline"}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={async () => {
              const oldKeyBind = structuredClone(unwrap(props.keyBind));
              props.setKeyBind(structuredClone(unwrap(keyBind)));
              props.setShow(false);
              const newKeyBind = structuredClone(unwrap(keyBind));
              props.reload(oldKeyBind, newKeyBind);
            }}
            disabled={!isUnique()}
          >
            Change
          </Button>
        </DialogFooter>
      </DialogHeader>
    </DialogContent>
  );
}

export default function KeyBindDialog(props: {
  class?: string,
  keyBind: KeyBind,
  setKeyBind: (keyBind: KeyBind) => void,
  show: boolean,
  setShow: (show: boolean) => void,
  reload: (oldKeyBind: KeyBind, newKeyBind: KeyBind) => void,
  id: number
}) {
  return (
    <Dialog open={props.show} onOpenChange={props.setShow}>
      <DialogTrigger
        as={(triggerProps: DialogTriggerProps) =>
          <Button size={"lg"} class={props.class} {...triggerProps}>
            Change
          </Button>
        } />
      <KeyBindDialogContent
        id={props.id}
        keyBind={props.keyBind}
        setKeyBind={props.setKeyBind}
        show={props.show}
        setShow={props.setShow}
        onCancel={() => {

        }}
        reload={props.reload}
      />
    </Dialog>
  );
}
