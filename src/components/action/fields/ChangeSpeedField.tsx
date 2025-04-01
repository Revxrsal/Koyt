import { createStore, Store } from "solid-js/store";
import { HotKey, VideoAction } from "~/gen/bindings";
import NumericalField from "~/components/action/fields/NumericalField";

export type ChangeSpeed = Extract<VideoAction, { ChangeSpeed: number }>

export default function ChangeSpeedField(props: { hotkey: Store<HotKey> }) {
  const [action, setAction] = createStore<ChangeSpeed>(props.hotkey.video_action as ChangeSpeed);
  return (
    <NumericalField
      value={action.ChangeSpeed}
      setValue={v => setAction("ChangeSpeed", v)}
      step={0.1}
      formatOptions={{ style: "decimal", signDisplay: "exceptZero" }}
    />
  );
}
