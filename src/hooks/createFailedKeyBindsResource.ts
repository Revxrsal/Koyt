import { commands } from "~/gen/bindings";
import { createResource } from "solid-js";
import { showErrorToast } from "~/util/toaster";

export function createFailedKeyBindsResource() {
  return createResource(async () => {
    const failed = await commands.getFailedKeyBinds();
    if (failed.status === "error") {
      showErrorToast("Error!", "Failed to retrieve failed keybinds. This should never happen!");
      return;
    }
    return failed.data!;
  }, { initialValue: {} });
}
