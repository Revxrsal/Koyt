import { createStore, Store } from "solid-js/store";
import { HotKey, VideoAction } from "~/gen/bindings";
import NumericalField from "~/components/action/fields/NumericalField";

export type Rewind = Extract<VideoAction, { Rewind: number }>

export default function RewindField(props: { hotkey: Store<HotKey> }) {
  const [action, setAction] = createStore<Rewind>(props.hotkey.video_action as Rewind);
  return (
    <NumericalField
      value={action.Rewind}
      minValue={1}
      setValue={v => setAction("Rewind", Math.max(v, 1))}
      step={1}
    />
  );
}
