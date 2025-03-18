import {useLocation, useNavigate} from "@solidjs/router";
import {open} from "@tauri-apps/plugin-dialog";
import {Button} from "~/components/ui/button";
import Kbd from "~/components/Kbd";

export default function ExternalOpenButton() {
  const navigate = useNavigate();
  const loc = useLocation();

  async function openFilePicker() {
    const file = await open({
      multiple: false,
      directory: false,
      filters: [{name: "Videos", extensions: ["mp4", "mkv"]}]
    });
    if (file) {
      localStorage.setItem("oxide_local", file);
      if (loc.pathname == "/local") {
        window.location.reload();
      } else {
        navigate("/local")
      }
    }
  }

  return <Button onClick={openFilePicker} class={"my-4"} hotkey={"o"}>Open file <Kbd>o</Kbd></Button>
}
