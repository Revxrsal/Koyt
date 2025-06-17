import { commands } from "~/gen/bindings";

export async function openChromeExtension() {
  await commands.openUrl("https://chromewebstore.google.com/detail/hdffofcnfjaehdacnbhccnhnomaihcok");
}

export function popHistory() {
  history.pushState(null, document.title, location.href);
  window.addEventListener("popstate", () => {
    history.pushState(null, document.title, location.href);
  });
}
