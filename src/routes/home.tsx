import {Button} from "~/components/ui/button";
import {Course, Episode} from "~/Course";
import {createMemo, For, onMount, Show} from "solid-js";
import {useNavigate} from "@solidjs/router";
import ExternalOpenButton from "~/components/ExternalOpenButton";
import ExternalOpenYouTubeButton from "~/components/ExternalYouTubeButton";
import BsCheck2All from "~/components/BsCheck2All";

export default function Home() {
  onMount(() => {
    localStorage.setItem("oxide_last_loc", `/home`);
  });
  const finished = createMemo(() => {
    const res = localStorage.getItem("oxide_finished")
    if (!res) return [];
    const values: string[] = JSON.parse(res)
    return values
  })
  return (
    <main class={"min-h-screen flex flex-col p-4 justify-center items-center"}>
      <h1 class={"text-center mt-20 mb-8 text-7xl font-bold select-none"}>
        Oxide
      </h1>
      <div class={"flex flex-row mb-8"}>
        <ExternalOpenButton/>
        <ExternalOpenYouTubeButton/>
      </div>
      <div class={"flex flex-col"}>
        <For each={Object.entries(Course)}>{([title, episodes], index) => (
          <Section title={title} episodes={episodes} index={index()} watched={finished()}/>
        )}</For>
      </div>
    </main>
  );
}

function Section(props: {
  title: string,
  episodes: Episode[],
  index: number,
  watched: string[]
}) {
  return (
    <div class={'flex flex-col'}>
      <h4 class={"select-none"}>{props.title}</h4>
      <div class={"flex flex-col"}>
        <For each={props.episodes}>{episode => (
          <ShowEpisode episode={episode} index={props.index}
                       watched={props.watched.includes(`${episode.section}/${episode.count}`)}/>
        )}
        </For>
      </div>
      <hr class={"my-3"}/>
    </div>
  )
}

function ShowEpisode(props: { episode: Episode, index: number, watched: boolean }) {
  const navigate = useNavigate();
  return (
    <Button class={"max-w-fit my-2"} onClick={() => navigate(`/play/${props.index}/${props.episode.count}`)}>
      <Show when={props.watched}>
        <BsCheck2All width={16} height={16} class={"me-4"}/>
      </Show>
      {props.episode.title}
    </Button>
  )
}
