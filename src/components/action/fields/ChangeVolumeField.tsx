import { createStore, Store } from "solid-js/store";
import { HotKey, VideoAction } from "~/gen/bindings";
import NumericalField from "~/components/action/fields/NumericalField";

export type ChangeVolume = Extract<VideoAction, { ChangeVolume: number }>

export default function ChangeVolumeField(props: { hotkey: Store<HotKey> }) {
  const [action, setAction] = createStore<ChangeVolume>(props.hotkey.video_action as ChangeVolume);
  return (
    <NumericalField
      value={action.ChangeVolume}
      minValue={0.1}
      setValue={v => setAction("ChangeVolume", Math.max(v, 0.1))}
      step={0.1}
      formatOptions={{ style: "decimal" }}
    />
  );
}
