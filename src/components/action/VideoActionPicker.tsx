import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { createStore, Store } from "solid-js/store";
import { BoolAction, HotKey, VideoAction } from "~/gen/bindings";
import { batch, Match, Show, Switch } from "solid-js";
import {
  fromVideoAction,
  toVideoAction,
  VideoActions,
  videoActionTakesData,
} from "~/components/action/SelectableVideoAction";
import ChangeSpeedField from "~/components/action/fields/ChangeSpeedField";
import SetSpeedField from "~/components/action/fields/SetSpeedField";
import BoolActionField from "~/components/action/fields/BoolActionField";
import SetVolumeField from "~/components/action/fields/SetVolumeField";
import ChangeVolumeField from "~/components/action/fields/ChangeVolumeField";
import ForwardField from "~/components/action/fields/ForwardField";
import RewindField from "~/components/action/fields/RewindField";

export type VideoActionWithData = Exclude<VideoAction, string>

export default function VideoActionPicker(props: {
  hotkey: Store<HotKey>,
}) {
  const [hotKey, setHotKey] = createStore(props.hotkey);
  return <>
    <Select
      required={true}
      class={"min-w-44"}
      value={fromVideoAction(hotKey.video_action)}
      onChange={(e) => {
        if (e) {
          const action = toVideoAction(e);
          batch(() => {
            setHotKey("video_action", null as never);
            setHotKey("video_action", action as never);
          });
        }
      }}
      options={VideoActions}
      itemComponent={props => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
    >
      <SelectTrigger>
        <SelectValue<string>>{state => state.selectedOption()}</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
    <div class={"mx-8"} />
    <Show when={videoActionTakesData(hotKey.video_action)} fallback={<div class={"min-w-64"} />}>
      <Switch>
        <Match when={"Playing" in (hotKey.video_action as VideoActionWithData)}>
          <BoolActionField
            value={(hotKey.video_action as Playing).Playing}
            setValue={v => {
              setHotKey("video_action", () => ({ Playing: v }));
            }}
          />
        </Match>
        <Match when={"Fullscreen" in (hotKey.video_action as VideoActionWithData)}>
          <BoolActionField
            value={(hotKey.video_action as Fullscreen).Fullscreen}
            setValue={v => {
              setHotKey("video_action", () => ({ Fullscreen: v }));
            }}
          />
        </Match>

        <Match when={"PiP" in (hotKey.video_action as VideoActionWithData)}>
          <BoolActionField
            value={(hotKey.video_action as PiP).PiP}
            setValue={v => {
              setHotKey("video_action", () => ({ PiP: v }));
            }}
          />
        </Match>
        <Match when={"Loop" in (hotKey.video_action as VideoActionWithData)}>
          <BoolActionField
            value={(hotKey.video_action as Loop).Loop}
            setValue={v => {
              setHotKey("video_action", () => ({ Loop: v }));
            }}
          />
        </Match>

        <Match when={"Subtitles" in (hotKey.video_action as VideoActionWithData)}>
          <BoolActionField
            value={(hotKey.video_action as Subtitles).Subtitles}
            setValue={v => {
              setHotKey("video_action", () => ({ Subtitles: v }));
            }}
          />
        </Match>

        <Match when={"ChangeSpeed" in (hotKey.video_action as VideoActionWithData)}>
          <ChangeSpeedField hotkey={hotKey} />
        </Match>
        <Match when={"SetSpeed" in (hotKey.video_action as VideoActionWithData)}>
          <SetSpeedField hotkey={hotKey} />
        </Match>

        <Match when={"ChangeVolume" in (hotKey.video_action as VideoActionWithData)}>
          <ChangeVolumeField hotkey={hotKey} />
        </Match>
        <Match when={"SetVolume" in (hotKey.video_action as VideoActionWithData)}>
          <SetVolumeField hotkey={hotKey} />
        </Match>

        <Match when={"Forward" in (hotKey.video_action as VideoActionWithData)}>
          <ForwardField hotkey={hotKey} />
        </Match>
        <Match when={"Rewind" in (hotKey.video_action as VideoActionWithData)}>
          <RewindField hotkey={hotKey} />
        </Match>
      </Switch>
    </Show>
  </>;
}

type Playing = Extract<VideoAction, { Playing: BoolAction }>
type PiP = Extract<VideoAction, { PiP: BoolAction }>
type Loop = Extract<VideoAction, { Loop: BoolAction }>
type Fullscreen = Extract<VideoAction, { Fullscreen: BoolAction }>
type Subtitles = Extract<VideoAction, { Subtitles: BoolAction }>


