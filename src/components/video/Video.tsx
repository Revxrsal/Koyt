import {createPlayer} from "~/player/player";
import {createSignal, JSXElement, onMount, Show} from "solid-js";
import {getCurrentWindow} from "@tauri-apps/api/window";
import {createKeyBind} from "~/components/util/keyboard";
import {Portal} from "solid-js/web";
import {convertFileSrc} from "@tauri-apps/api/core";

export default function Video(props: {file: string, id?: string, controls?: JSXElement}) {
  const [controlsContainer, setControlsContainer] = createSignal<Element | null>(null);
  const assetUrl = convertFileSrc(props.file)

  let video: HTMLVideoElement | undefined;
  const [speed, setSpeed] = createSignal(1.0);
  const [fullScreen, setFullScreen] = createSignal(false);
  const player = createPlayer(() => video!, {
    disableContextMenu: false,
    keyboard: {
      global: true
    },
    speed: {
      selected: 1,
      options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4],
    },
    storage: {
      enabled: true,
      key: "oxide.player"
    },
  });

  onMount(() => {
    player().on("enterfullscreen", async () => {
      setFullScreen(true);
      await getCurrentWindow().setFullscreen(true);
    })
    player().on("exitfullscreen", async () => {
      setFullScreen(false);
      await getCurrentWindow().setFullscreen(false);
    })
    player().on("ratechange", () => {
      setSpeed(player().speed);
      const controlsBar = document.querySelector('.plyr__controls');
      if (controlsBar) {
        setControlsContainer(controlsBar!)
      }
    })
    player().on("ready", () => {
      if (props.id) {
        const lastStoppedAt = localStorage.getItem(`oxide_${props.id}`);
        if (lastStoppedAt !== null) {
          video!.currentTime = (parseInt(lastStoppedAt, 10));
          console.log(`Started from where you stopped last time: ${lastStoppedAt}`);
        }
      }
    })

    player().on("timeupdate", () => {
      if (props.id) {
        const time = player().currentTime
        if (time !== 0) {
          localStorage.setItem(`oxide_${props.id}`, time.toString());
        }
      }
    })
  })
  createKeyBind("s", () => {
    player().speed = Math.max(player().speed - 0.1, 0.5);
  })
  createKeyBind("p", () => {
    player().speed += 0.1;
  })
  createKeyBind("z", () => player().rewind(5))
  createKeyBind("x", () => player().forward(5))
  return (
    <>
      <div class={"w-7/12 justify-center rounded-md p-2 relative inline-block"}>
        <video class={fullScreen() ? "" : "rounded-md"} ref={v => video = v} controls={true}>
          <source type={"video/mp4"} src={assetUrl}/>
        </video>
      </div>
      <Show when={controlsContainer()}>
        <Portal mount={controlsContainer()!}>
          <span class="bg-black bg-opacity-50 ms-1   px-3 py-1 rounded text-sm">
            ×{speed().toFixed(2)}
          </span>
          {props.controls}
        </Portal>
      </Show>
    </>
  )
}