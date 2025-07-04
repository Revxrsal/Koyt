import { commands, events } from "~/gen/bindings";
import { createResource, onCleanup } from "solid-js";
import { showErrorToast } from "~/util/toaster";
import { setPreferences } from "~/util/preferences";

export function createFailedHostResource() {
  const resource = createResource(async () => {
    const failed = await commands.failedToRegisterHosts();
    if (failed.status === "error") {
      showErrorToast("Error!", "Failed to retrieve whether host registration was successful or not. This should never happen!");
      return;
    }
    return failed.data!;
  }, { initialValue: false });
  const [_, { mutate }] = resource;
  events.clientConnectedEvent.listen(() => {
    mutate(false);
  }).then(unlisten => {
    setPreferences("dismissHostRegistrationWarning", true);
    onCleanup(unlisten);
  });
  return resource;
}
