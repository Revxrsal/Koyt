import { commands } from "~/gen/bindings";

export async function openChromeExtension() {
  await commands.openUrl("https://chromewebstore.google.com/detail/hdffofcnfjaehdacnbhccnhnomaihcok");
}
