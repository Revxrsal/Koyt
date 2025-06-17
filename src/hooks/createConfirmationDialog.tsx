import { createSignal, JSXElement } from "solid-js";
import { createEventListener } from "~/hooks/createEventListener";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "~/components/ui/alert-dialog";

export function createConfirmationDialog(
  confirm: () => void,
  skipWithShift: boolean = true,
) {

  const [show, setShow] = createSignal(false);
  let shiftKey: boolean = false;

  if (skipWithShift) {
    function onKeyboardEvent(event: KeyboardEvent) {
      if (!event.repeat)
        shiftKey = event.shiftKey;
    }

    createEventListener("keyup", onKeyboardEvent);
    createEventListener("keydown", onKeyboardEvent);
  }

  return {
    openConfirmationDialog: () => {
      if (shiftKey)
        confirm();
      else
        setShow(true);
    },
    ConfirmationDialog: (props: { children: JSXElement }) => (
      <AlertDialog open={show()} onOpenChange={setShow}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogHeader>
              <h3>Are you sure?</h3>
            </AlertDialogHeader>
          </AlertDialogHeader>

          <div class={"py-2"}>
            {props.children}
            <p>
              <sub><strong>Note</strong>: You can hold shift to prevent this modal from appearing.</sub>
            </p>
          </div>
          <AlertDialogFooter class={"flex"}>
              <AlertDialogClose>
                Cancel
              </AlertDialogClose>
              <AlertDialogAction onClick={confirm}>
                Continue
              </AlertDialogAction>
            {/*<Button*/}
            {/*  onClick={() => setShow(false)}*/}
            {/*  variant={"outline"}*/}
            {/*>*/}
            {/*  Cancel*/}
            {/*</Button>*/}
            {/*<Button*/}
            {/*  type="submit"*/}
            {/*  onClick={async () => {*/}
            {/*    setShow(false);*/}
            {/*    confirm();*/}
            {/*  }}*/}
            {/*>*/}
            {/*  Confirm*/}
            {/*</Button>*/}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
  };
}
