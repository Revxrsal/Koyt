import { render } from "solid-js/web";
import { createSignal } from "solid-js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import { openDownloadPage } from "~/hooks/createLicenseHandler";

export function createHostRegistrationDialog() {
  const [open, setOpen] = createSignal(false);
  render(() => (
    <BrokenMicrosoftDialog open={open()} setOpen={setOpen} />
  ), document.body);

  return { openBrokenMicrosoftDialog: () => setOpen(true) };
}

function BrokenMicrosoftDialog(props: { open: boolean, setOpen: (open: boolean) => void }) {
  return (
    <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <h3>
            This feature is not available on the Microsoft Store edition. 🥲
          </h3>
        </AlertDialogHeader>
        <p>
          Unfortunately, Microsoft imposes very strict guidelines on apps
          released on the Microsoft Store. This is completely understandable as
          they need to protect their customers from malicious actors.
        </p>
        <p>
          However, this also restricts the capabilities of Keyboard-Operated YouTube and does not allow it to fully
          function.
        </p>
        <p>
          Therefore, if you would like to access this feature, please download the app from
          the <span class="text-primary underline cursor-pointer" onClick={openDownloadPage}>official website</span>.
        </p>
        <AlertDialogFooter class={"flex"}>
          <AlertDialogClose onClick={() => props.setOpen(false)}>
            Dismiss
          </AlertDialogClose>
          <AlertDialogAction onClick={openDownloadPage}>
            Get the full version
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

