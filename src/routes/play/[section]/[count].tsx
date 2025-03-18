import {Params, useNavigate, useParams} from "@solidjs/router";
import {CourseEntries, CourseSections, Episode} from "~/Course";
import Video from "~/components/video/Video";
import {createMemo, onMount, Show} from "solid-js";
import {Button} from "~/components/ui/button";
import Kbd from "~/components/Kbd";
import Shortcuts from "~/components/Shortcuts";
import ExternalOpenButton from "~/components/ExternalOpenButton";
import Extensions from "~/components/extensions/Extensions";
import ExternalOpenYouTubeButton from "~/components/ExternalYouTubeButton";

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

  onMount(() => {
    localStorage.setItem("oxide_last_loc", `/play/${section()}/${count()}`);
  });
  return <div class={"min-h-screen flex flex-col justify-center items-center"}>
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
    <h3>{episode().title}</h3>
    <p>{CourseSections[episode().section]}</p>
    <Video
      file={episode().path}
      id={`${section()}/${count()}`}
    />
    <div class={"flex flex-row justify-between w-7/12"}>
      <Show when={previousEpisode()} fallback={<div class={"m-4"} />}>
        <Button class={"m-4 py-8"} hotkey={"q"} onClick={() => goToEpisode(previousEpisode()!)}>
          Previous: {previousEpisode()!.title} <Kbd>q</Kbd>
        </Button>
      </Show>

      <Show when={nextEpisode()} fallback={<div class={"m-4"} />}>
        <Button class={"m-4 py-8"} hotkey={"w"} onClick={() => goToEpisode(nextEpisode()!)}>
          Next: {nextEpisode()!.title} <Kbd>w</Kbd>
        </Button>
      </Show>
    </div>
    <div class={"flex flex-col w-7/12 my-4 justify-center"}>
      <h2 class={"font-bold text-center"}>Keyboard shortcuts</h2>
      <Shortcuts />
      <Extensions />
    </div>
  </div>
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


