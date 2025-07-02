import { render } from "solid-js/web";
import { createResource, createSignal, Match, onMount, Switch } from "solid-js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import { openNativeMessaging } from "~/hooks/createLicenseHandler";
import { latestVersion } from "~/hooks/createVersionChecker";
import { getVersion } from "@tauri-apps/api/app";
import { preferences, setPreferences } from "~/util/preferences";
import { UserOS } from "~/util/os";
import { commands } from "~/gen/bindings";
import { showErrorToast } from "~/util/toaster";
import { isMicrosoftVersion } from "~/app";
import { createFailedHostResource } from "~/hooks/createFailedHostResource";

interface HostRegistrationDialogProps {
  open: boolean,
  setOpen: (open: boolean) => void,
  dismiss: () => void,
}

export function createHostRegistrationDialog() {
  const [open, setOpen] = createSignal(false);
  const [failedToRegisterHost] = createFailedHostResource();

  function dismiss() {
    setPreferences("dismissHostRegistrationWarning", true);
  }

  onMount(() => {
    if (failedToRegisterHost() && isMicrosoftVersion() && !preferences.dismissHostRegistrationWarning) {
      setOpen(true);
    }
  });

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
  async function openInstallation() {
    const result = await commands.installRegistryScripts();
    if (result.status === "error") {
      showErrorToast("Error!", "Failed to install registry script: " + result.error);
    }
  }

  return (
    <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <h3>
            Additional setup needed
          </h3>
        </AlertDialogHeader>
        <p>
          Because Microsoft restricts applications from installing browser apps, we kindly ask you to do it
          yourself:
        </p>
        <ol class={"list-disc mx-4"}>
          <li>
            <span role={"link"} class={"cursor-pointer text-primary underline"} onClick={openInstallation}>
              Save this registry script anywhere on your device
            </span>
          </li>
          <li>Run it</li>
        </ol>
        <footer>
          <small>
            The application will not work if you do not do this! Only dismiss when the app actually
            works. It simply registers the app to your browser's <span class={"text-primary cursor-pointer underline"} onClick={openNativeMessaging}>native application list</span>.
          </small>
        </footer>
        <AlertDialogFooter class={"flex"}>
          <AlertDialogClose onClick={() => props.setOpen(false)}>
            Do it later
          </AlertDialogClose>
          <AlertDialogAction onClick={props.dismiss}>
            I've done this. Hide the warning
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
          <AlertDialogClose onClick={() => props.setOpen(false)}>
            Do it later
          </AlertDialogClose>
          <AlertDialogAction onClick={props.dismiss}>
            I've done this. Hide the warning
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
          <AlertDialogClose onClick={() => props.setOpen(false)}>
            Do it later
          </AlertDialogClose>
          <AlertDialogAction onClick={props.dismiss}>
            I've done this. Hide the warning
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
