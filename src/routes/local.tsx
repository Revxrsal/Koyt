import {useNavigate} from "@solidjs/router";
import {createEffect, createSignal, onMount, Show} from "solid-js";
import {Button} from "~/components/ui/button";
import Kbd from "~/components/Kbd";
import Video from "~/components/video/Video";
import Shortcuts from "~/components/Shortcuts";
import {open} from "@tauri-apps/plugin-dialog";
import Extensions from "~/components/extensions/Extensions";

export default function Local() {
  const navigate = useNavigate();
  const [file, setFile] = createSignal<string>("");

  async function openFilePicker() {
    const file = await open({
      multiple: false,
      directory: false,
      filters: [{name: "Videos", extensions: ["mp4", "mkv"]}]
    });
    setFile(file || "");
  }

  onMount(() => {
    const file = localStorage.getItem("oxide_local");
    if (file) {
      setFile(file);
    }
  })
  createEffect(() => {
    localStorage.setItem("oxide_last_loc", `/local`);
    localStorage.setItem("oxide_local", file());
  });
  return (
    <div class={"min-h-screen flex flex-col justify-center items-center"}>
      <div class={"flex flex-row"}>
        <Button
          class={"m-4"}
          onClick={() => navigate("/")}
          hotkey={"h"}
        >
          Home <Kbd>h</Kbd>
        </Button>
        <Button
          hotkey={"o"}
          class={"m-4"}
          onClick={openFilePicker}
        >
          Open file <Kbd>o</Kbd>
        </Button>
      </div>
      z
      <Show when={file()}>
        <Video file={file()!} id={file()!}/>
        <p class={"my-8 max-w-[58%]"}>{file()}</p>
      </Show>
      <div class={"flex flex-col w-full my-4 justify-center items-center"}>
        <h2 class={"font-bold text-center"}>Keyboard shortcuts</h2>
        <Shortcuts/>
        <Extensions/>
      </div>
    </div>
  )
}
