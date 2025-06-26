import { render } from "solid-js/web";
import { createResource, createSignal, Match, Switch } from "solid-js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import { openDownloadPage } from "~/hooks/createLicenseHandler";
import { latestVersion } from "~/hooks/createVersionChecker";
import { getVersion } from "@tauri-apps/api/app";
import { preferences, setPreferences } from "~/util/preferences";
import { UserOS } from "~/util/os";

interface HostRegistrationDialogProps {
  open: boolean,
  setOpen: (open: boolean) => void,
  dismiss: () => void,
}

export function createHostRegistrationDialog() {
  const [open, setOpen] = createSignal(false);

  function dismiss() {
    setPreferences("dismissHostRegistrationWarning", true);
  }

  render(() => (
    <Switch>
      <Match when={UserOS === "Windows"}>
        <WindowsDialog open={open()} setOpen={setOpen} dismiss={dismiss} />;
      </Match>
      <Match when={UserOS === "MacOS"}>
        <MacOSDialog open={open()} setOpen={setOpen} dismiss={dismiss} />;
      </Match>
      <Match when={UserOS === "Linux"}>
        <LinuxDialog open={open()} setOpen={setOpen} dismiss={dismiss} />;
      </Match>
    </Switch>
  ), document.body);

  return {
    dismissHostRegistrationError: () => preferences.dismissHostRegistrationWarning,
    openHostRegistrationDialog: () => setOpen(true),
  };
}

function WindowsDialog(props: HostRegistrationDialogProps) {
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
          <AlertDialogClose onClick={props.dismiss}>
            I've done this. Hide the warning
          </AlertDialogClose>
          <AlertDialogAction onClick={openDownloadPage}>
            Install script
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function MacOSDialog(props: HostRegistrationDialogProps) {
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
          <AlertDialogClose onClick={props.dismiss}>
            I've done this. Hide the warning
          </AlertDialogClose>
          <AlertDialogAction onClick={openDownloadPage}>
            Install script
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function LinuxDialog(props: HostRegistrationDialogProps) {
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
          <AlertDialogClose onClick={props.dismiss}>
            I've done this. Hide the warning
          </AlertDialogClose>
          <AlertDialogAction onClick={openDownloadPage}>
            Install script
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
