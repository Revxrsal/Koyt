import {useNavigate} from "@solidjs/router";
import {createSignal, onMount, Show} from "solid-js";
import {Button} from "~/components/ui/button";
import Kbd from "~/components/Kbd";
import Video from "~/components/video/Video";
import Shortcuts from "~/components/Shortcuts";
import Extensions from "~/components/extensions/Extensions";
import ExternalOpenButton from "~/components/ExternalOpenButton";
import ExternalOpenYouTubeButton from "~/components/ExternalYouTubeButton";
import {UserOS} from "~/util/os";

export default function Local() {
  const navigate = useNavigate();
  const [file, setFile] = createSignal<string>("");

  onMount(() => {
    const file = localStorage.getItem("oxide_local");
    if (file) {
      setFile(file);
    }
  })
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
        <ExternalOpenButton/>
        <ExternalOpenYouTubeButton/>
      </div>

      <Show when={file()}>
        <Video file={file()!} id={file()!}/>
        <p class={"my-8 max-w-[58%]"}>{file()}</p>
      </Show>
      <div class={"flex flex-col w-7/12 my-4 justify-center"}>
        <h2 class={"font-bold text-center"}>Keyboard shortcuts</h2>
        <Shortcuts/>
        <Show when={UserOS == "Windows"}>
          <Extensions/>
        </Show>
      </div>
    </div>
  )
}
