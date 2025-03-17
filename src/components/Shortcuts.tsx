import ShtCt from "~/components/ShtCt";

export default function Shortcuts() {
  return (
    <ul class={"w-full flex flex-col"}>
      <ShtCt
        label={"Forward 5s"}
        shortcut={"x"}
      />
      <ShtCt
        label={"Rewind 5s"}
        shortcut={"z"}
      />
      <ShtCt
        label={"Toggle fullscreen"}
        shortcut={"F"}
      />
      <ShtCt
        label={"Playback speed +0.1"}
        shortcut={"P"}
      />
      <ShtCt
        label={"Playback speed -0.1"}
        shortcut={"S"}
      />
      <ShtCt
        label={"Pause/Play"}
        shortcut={"K"}
      />
      <ShtCt
        label={"Home"}
        shortcut={"H"}
      />
      <ShtCt
        label={"Next episode"}
        shortcut={"W"}
      />
      <ShtCt
        label={"Previous episode"}
        shortcut={"Q"}
      />
      <ShtCt
        label={"Play/Pause (even unfocused)"}
        shortcut={"Ctrl + Shift + C"}
      />
    </ul>
  )
}