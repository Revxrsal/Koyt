import {useNavigate} from "@solidjs/router";
import {createEffect, createSignal, onMount, Show} from "solid-js";
import {Button} from "~/components/ui/button";
import Kbd from "~/components/Kbd";
import Video from "~/components/video/Video";
import Shortcuts from "~/components/Shortcuts";
import Extensions from "~/components/extensions/Extensions";
import ExternalOpenButton from "~/components/ExternalOpenButton";
import ExternalOpenYouTubeButton from "~/components/ExternalYouTubeButton";

export default function YouTube() {
  const navigate = useNavigate();
  const [url, setURL] = createSignal<string>("");
  onMount(() => {
    const url = localStorage.getItem("oxide_yt");
    if (url) {
      setURL(url);
    }
  })
  createEffect(() => {
    localStorage.setItem("oxide_last_loc", `/youtube`);
    localStorage.setItem("oxide_yt", url());
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
        <ExternalOpenButton />
        <ExternalOpenYouTubeButton />
      </div>

      <Show when={url()}>
        <Video youtube={url()!} id={url()!} />
        <p class={"my-8 max-w-[58%]"}>{url()}</p>
      </Show>
      <div class={"flex flex-col w-7/12 my-4 justify-center"}>
        <h2 class={"font-bold text-center"}>Keyboard shortcuts</h2>
        <Shortcuts />
        <Extensions />
      </div>
    </div>
  )
}
