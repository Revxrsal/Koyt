import {useNavigate} from "@solidjs/router";
import {createEffect, createSignal, onMount, Show} from "solid-js";
import {Button} from "~/components/ui/button";
import Kbd from "~/components/Kbd";
import Video from "~/components/video/Video";
import Shortcuts from "~/components/Shortcuts";
import Extensions from "~/components/extensions/Extensions";
import ExternalOpenButton from "~/components/ExternalOpenButton";
import ExternalOpenYouTubeButton from "~/components/ExternalYouTubeButton";
import { getYouTubeTitle } from "~/util/youtube";

export default function YouTube() {
  const navigate = useNavigate();
  const [url, setURL] = createSignal<string>("");
  const [title, setTitle] = createSignal<string>("");
  onMount(async () => {
    const url = localStorage.getItem("oxide_yt");
    if (url) {
      setURL(url);
      setTitle(await getYouTubeTitle(url));
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
      </Show>
      <Show when={title()}>
        <p class={"mt-8 mb-2 text-2xl max-w-[58%]"}>{title()}</p>
      </Show>
      <Show when={url()}>
        <a href={url()} class={"underline max-w-[58%] mb-8"}>{url()}</a>
      </Show>
      <div class={"flex flex-col w-7/12 my-4 justify-center"}>
        <h2 class={"font-bold text-center"}>Keyboard shortcuts</h2>
        <Shortcuts />
        <Extensions />
      </div>
    </div>
  )
}
