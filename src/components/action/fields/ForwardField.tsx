import { createStore, Store } from "solid-js/store";
import { HotKey, VideoAction } from "~/gen/bindings";
import NumericalField from "~/components/action/fields/NumericalField";

export type Forward = Extract<VideoAction, { Forward: number }>

export default function ForwardField(props: { hotkey: Store<HotKey> }) {
  const [action, setAction] = createStore<Forward>(props.hotkey.video_action as Forward);
  return (
    <NumericalField
      value={action.Forward}
      minValue={1}
      setValue={v => setAction("Forward", Math.max(v, 1))}
      step={1}
    />
  );
}
