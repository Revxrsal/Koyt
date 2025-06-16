import { commands } from "~/gen/bindings";
import { showErrorToast } from "~/util/toaster";
import { createResource } from "solid-js";

async function getSystemFonts() {
  const fontsResult = await commands.getSystemFonts();
  if (fontsResult.status === "ok")
    return fontsResult.data;
  showErrorToast("Error!", `Failed to retrieve system fonts: ${fontsResult.error}`);
  return [];
}

export function createFontsResource() {
  return createResource(getSystemFonts, { initialValue: [] });
}
