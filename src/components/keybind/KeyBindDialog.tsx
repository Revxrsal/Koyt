import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { DialogTriggerProps } from "@kobalte/core/dialog";
import { Button } from "~/components/ui/button";
import KeyBindRecorder from "~/components/keybind/KeyBindRecorder";
import { KeyBind } from "~/gen/bindings";
import { createStore, unwrap } from "solid-js/store";

function KeyBindDialogContent(props: {
  keyBind: KeyBind,
  setKeyBind: (keyBind: KeyBind) => void,
  show: boolean,
  setShow: (show: boolean) => void,
  reload: (oldKeyBind: KeyBind, newKeyBind: KeyBind) => void,
}) {
  const [keyBind, setKeyBind] = createStore(structuredClone(unwrap(props.keyBind)));
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Change key bind
        </DialogTitle>

        <KeyBindRecorder
          keyBind={keyBind}
          setKeyBind={setKeyBind}
        />

        <DialogFooter class={"select-none"}>
          <Button
            onClick={() => props.setShow(false)}
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
        keyBind={props.keyBind}
        setKeyBind={props.setKeyBind}
        show={props.show}
        setShow={props.setShow}
        reload={props.reload}
      />
    </Dialog>
  );
}
