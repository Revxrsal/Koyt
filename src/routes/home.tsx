import {Button} from "~/components/ui/button";
import {Course, Episode} from "~/Course";
import {For, onMount} from "solid-js";
import {useNavigate} from "@solidjs/router";

export default function Home() {
  onMount(() => {
    localStorage.setItem("oxide_last_loc", `/home`);
  });
  return (
    <main class={"min-h-screen flex flex-col p-4 justify-center items-center"}>
      <h1 class={"text-center my-4 text-7xl font-bold select-none"}>
        Oxide
      </h1>
      <div class={"flex flex-col"}>
        <For each={Object.entries(Course)}>{([title, episodes], index) => (
          <Section title={title} episodes={episodes} index={index()}/>
        )}</For>
      </div>
    </main>
  );
}

function Section(props: {
  title: string;
  episodes: Episode[];
  index: number;
}) {
  return (
    <div class={'flex flex-col'}>
      <h4 class={"select-none"}>{props.title}</h4>
      <div class={"flex flex-col"}>
        <For each={props.episodes}>{episode => (
          <ShowEpisode episode={episode} index={props.index}/>
        )}
        </For>
      </div>
      <hr class={"my-3"}/>
    </div>
  )
}

function ShowEpisode(props: { episode: Episode, index: number }) {
  const navigate = useNavigate();
  return (
    <Button class={"max-w-fit my-2"} onClick={() => navigate(`/play/${props.index}/${props.episode.count}`)}>
      {props.episode.title}
    </Button>
  )
}