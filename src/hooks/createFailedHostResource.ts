import { commands } from "~/gen/bindings";
import { createResource } from "solid-js";
import { showErrorToast } from "~/util/toaster";

export function createFailedHostResource() {
  return createResource(async () => {
    const failed = await commands.failedToRegisterHosts();
    if (failed.status === "error") {
      showErrorToast("Error!", "Failed to retrieve whether host registration was successful or not. This should never happen!");
      return;
    }
    return failed.data!;
  }, { initialValue: false });
}
