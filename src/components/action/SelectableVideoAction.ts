import { VideoAction } from "~/gen/bindings";

const toHumanString: Record<string, SelectableVideoAction> = {
  Nothing: "Do nothing",
  Playing: "Playing",
  Fullscreen: "Full screen",
  Subtitles: "Subtitles",
  PiP: "Play in picture (PiP)",
  Loop: "Loop",
  ChangeSpeed: "Change Speed",
  SetSpeed: "Set Speed",
  ChangeVolume: "Change Volume",
  SetVolume: "Set Volume",
  Forward: "Forward",
  Rewind: "Rewind",
  TakeScreenshot: "Take Screenshot",
};

const fromHumanString: Record<SelectableVideoAction, VideoAction> = {
  "Do nothing": "Nothing",
  "Change Speed": { ChangeSpeed: 1 },
  "Change Volume": { ChangeVolume: 1 },
  "Full screen": { Fullscreen: "Toggle" },
  "Play in picture (PiP)": { PiP: "Toggle" },
  "Set Speed": { SetSpeed: 1 },
  "Set Volume": { SetVolume: 1 },
  "Take Screenshot": "TakeScreenshot",
  "Forward": { Forward: 5 },
  "Loop": { Loop: "Toggle" },
  "Playing": { Playing: "Toggle" },
  "Rewind": { Rewind: 5 },
  "Subtitles": { Subtitles: "Toggle" },
};

export type SelectableVideoAction =
  "Do nothing" |
  "Playing" |
  "Full screen" |
  "Subtitles" |
  "Play in picture (PiP)" |
  "Loop" |
  "Change Speed" |
  "Set Speed" |
  "Change Volume" |
  "Set Volume" |
  "Forward" |
  "Rewind" |
  "Take Screenshot";

export const VideoActions = Object.values(toHumanString);

export function fromVideoAction(action: VideoAction): SelectableVideoAction {
  if (typeof action === "string") {
    return toHumanString[action];
  }
  const key = Object.keys(action)[0];
  return toHumanString[key];
}

export function videoActionTakesData(action: VideoAction): boolean {
  return typeof action !== "string";
}

export function toVideoAction(videoAction: SelectableVideoAction): VideoAction {
  return structuredClone(fromHumanString[videoAction]);
}
