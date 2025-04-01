import { createStore, Store } from "solid-js/store";
import { HotKey, VideoAction } from "~/gen/bindings";
import NumericalField from "~/components/action/fields/NumericalField";

export type SetSpeed = Extract<VideoAction, { SetSpeed: number }>

export default function SetSpeedField(props: { hotkey: Store<HotKey> }) {
  const [action, setAction] = createStore<SetSpeed>(props.hotkey.video_action as SetSpeed);
  return (
    <NumericalField
      value={action.SetSpeed}
      minValue={0.1}
      setValue={v => setAction("SetSpeed", Math.max(v, 0.1))}
      step={0.1}
      formatOptions={{ style: "decimal" }}
    />
  );
}
