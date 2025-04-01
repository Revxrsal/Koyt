import { createStore, Store } from "solid-js/store";
import { HotKey, VideoAction } from "~/gen/bindings";
import NumericalField from "~/components/action/fields/NumericalField";

export type SetVolume = Extract<VideoAction, { SetVolume: number }>

export default function SetVolumeField(props: { hotkey: Store<HotKey> }) {
  const [action, setAction] = createStore<SetVolume>(props.hotkey.video_action as SetVolume);
  return (
    <NumericalField
      value={action.SetVolume}
      minValue={0.1}
      setValue={v => setAction("SetVolume", Math.max(v, 0.1))}
      step={0.1}
      formatOptions={{ style: "decimal" }}
    />
  );
}
