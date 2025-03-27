import {commands} from "~/gen/bindings";

export function addF11Listener() {
  document.addEventListener("keydown", async event => {
    if ((event.key === "F11" || event.keyCode === 122) && !event.repeat) {
      event.preventDefault();
      await commands.toggleFullscreen()
    }
  });
}
