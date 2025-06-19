import { render } from "solid-js/web";
import { createResource, createSignal } from "solid-js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import { openDownloadPage } from "~/hooks/createLicenseHandler";
import { isUpdateAvailable, latestVersion } from "~/hooks/createVersionChecker";
import { getVersion } from "@tauri-apps/api/app";

export function createUpdateChecker() {
  const [open, setOpen] = createSignal(false);
  render(() => (
    <UpdateDialog open={open()} setOpen={setOpen} />
  ), document.body);
  return {
    isUpdateDue: isUpdateAvailable,
    openUpdateDialog: () => setOpen(true),
  };
}

function UpdateDialog(props: { open: boolean, setOpen: (open: boolean) => void }) {
  const [version] = createResource(getVersion);
  return (
    <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <h3>
            Hey friend! An update is available 🔥
          </h3>
        </AlertDialogHeader>
        <p>
          <strong>Your version: </strong> {version()}
          <br />
          <strong>Latest version: </strong> {latestVersion()}
        </p>
        <p>
          You will miss on neat features and bug fixes if you don't update!
        </p>
        <AlertDialogFooter class={"flex"}>
          <AlertDialogClose>
            Dismiss
          </AlertDialogClose>
          <AlertDialogAction onClick={openDownloadPage}>
            Woo hoo! Let's go
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
