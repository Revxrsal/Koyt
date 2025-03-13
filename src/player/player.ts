import Plyr from "plyr";
import {Accessor, createSignal, onMount} from "solid-js";

export function createPlayer(elem: () => HTMLElement, options: Plyr.Options): Accessor<Plyr> {
  const [value, setValue] = createSignal<Plyr | null>(null)
  onMount(() => {
    const player = new Plyr(elem(), options);
    setValue(player)
  });
  return () => value()!;
}