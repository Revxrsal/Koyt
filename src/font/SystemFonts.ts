import { commands } from "~/gen/bindings";
import { showErrorToast } from "~/util/toaster";

export async function getSystemFonts() {
  const fontsResult = await commands.getSystemFonts();
  if (fontsResult.status === "ok")
    return fontsResult.data;
  showErrorToast("Error!", `Failed to retrieve system fonts: ${fontsResult.error}`);
  return [];
}
