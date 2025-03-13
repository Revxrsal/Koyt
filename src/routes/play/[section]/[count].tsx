import {Params, useNavigate, useParams} from "@solidjs/router";
import {CourseEntries, Episode} from "~/Course";
import Video from "~/components/video/Video";
import {createMemo, JSXElement, Show} from "solid-js";
import {Button} from "~/components/ui/button";

export interface PathProps extends Params {
  section: string;
  count: string;
}

export default function Play() {
  const navigate = useNavigate();
  const params = useParams<PathProps>();
  const section = () => parseInt(params.section);
  const count = () => parseInt(params.count);
  const episode = createMemo(() => CourseEntries[section()][count()]);
  const previousEpisode = createMemo(() => findPreviousEpisode(section(), count()));
  const nextEpisode = createMemo(() => findNextEpisode(section(), count()));

  function goToEpisode(ep: Episode) {
    window.location.replace(episodeUrl(ep));
  }

  return (
    <div class={"min-h-screen flex flex-col justify-center items-center"}>
      <Button
        class={"m-4"}
        onClick={() => navigate("/")}
        hotkey={"h"}
      >
        Home <Kbd>h</Kbd>
      </Button>
      <h3>{episode().title}</h3>
      <Video file={episode().path}/>
      <div class={"flex flex-row justify-between w-7/12"}>
        <Show when={previousEpisode()} fallback={<div class={"m-4"}/>}>
          <Button class={"m-4 py-8"} hotkey={"q"} onClick={() => goToEpisode(previousEpisode()!)}>
            Previous: {previousEpisode()!.title} <Kbd>q</Kbd>
          </Button>
        </Show>

        <Show when={nextEpisode()} fallback={<div class={"m-4"}/>}>
          <Button class={"m-4 py-8"} hotkey={"w"} onClick={() => goToEpisode(nextEpisode()!)}>
            Next: {nextEpisode()!.title} <Kbd>w</Kbd>
          </Button>
        </Show>
      </div>
      <div class={"flex flex-col my-4 justify-center"}>
        <h2 class={"font-bold text-center"}>Keyboard shortcuts</h2>
        <ul class={"w-full flex flex-col"}>
          <ShtCt
            label={"Forward 5s"}
            shortcut={"x"}
          />
          <ShtCt
            label={"Rewind 5s"}
            shortcut={"z"}
          />
          <ShtCt
            label={"Toggle fullscreen"}
            shortcut={"F"}
          />
          <ShtCt
            label={"Playback speed +0.1"}
            shortcut={"P"}
          />
          <ShtCt
            label={"Playback speed -0.1"}
            shortcut={"S"}
          />
          <ShtCt
            label={"Pause/Play"}
            shortcut={"K"}
          />
          <ShtCt
            label={"Home"}
            shortcut={"H"}
          />
          <ShtCt
            label={"Next episode"}
            shortcut={"W"}
          />
          <ShtCt
            label={"Previous episode"}
            shortcut={"Q"}
          />
        </ul>

      </div>
    </div>
  )
}

function ShtCt(props: { label: string, shortcut: string }) {
  return (
    <li class={"list-disc flex flex-row justify-between my-2"}>
      <span class={"font-semibold"}>{props.label}</span>
      <kbd class={"font-normal text-sm bg-muted px-1.5 py-1.5 rounded shadow-2xl"}>{props.shortcut}</kbd>
    </li>
  )
}

function episodeUrl(episode: Episode): string {
  return `/play/${episode.section}/${episode.count}`
}

function findNextEpisode(section: number, count: number): Episode | null {
  const current = CourseEntries[section]
  if (current.length == count + 1) {
    if (CourseEntries.length == section + 1)
      return null
    return CourseEntries[section + 1][0]
  }
  return current[count + 1]
}

function findPreviousEpisode(section: number, count: number): Episode | null {
  const current = CourseEntries[section]
  if (count == 0) {
    if (section == 0)
      return null
    const previousSection = CourseEntries[section - 1]
    return previousSection[previousSection.length - 1]
  }
  return current[count - 1]
}


function Kbd(props: { children: JSXElement }) {
  return (
    <kbd
      class="pointer-events-none inline-flex h-5 select-none items-center gap-1 ms-4 rounded border px-1.5 font-mono text-[10px] font-medium text-muted opacity-100">
      {props.children}
    </kbd>
  )
}

function Cmd() {
  return <span class="text-xs">⌘</span>
}