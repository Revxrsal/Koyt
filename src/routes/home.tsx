import Main from "~/components/layout/Main";
import { For, Show } from "solid-js";
import { useSettings } from "~/util/settings";
import { Card } from "~/components/ui/card";
import { HotKey } from "~/gen/bindings";
import { Button } from "~/components/ui/button";
import { createKeyBindDialog } from "~/components/keybind/KeyBindModal";
import DisplayKeyBind from "~/components/keybind/DisplayKeyBind";
import { createConfirmationDialog } from "~/hooks/createConfirmationDialog";
import { VsSettings } from "solid-icons/vs";
import { useNavigate } from "@solidjs/router";
import VideoActionPicker from "~/components/action/VideoActionPicker";
import { AiTwotoneDelete } from "solid-icons/ai";
import { openChromeExtension } from "~/util/links";
import { createHotKeyCreator, createKeyBindController } from "~/hooks/createKeyBindController";
import { IoExtensionPuzzleOutline } from "solid-icons/io";
import { MAX_FREE_HOTKEYS, usePaywall } from "~/hooks/usePaywall";


export default function Home() {
  const navigate = useNavigate();
  const [settings] = useSettings();
  const { KeyBindDialog, openKeyBindDialog } = createKeyBindDialog();
  const { createHotKey } = createHotKeyCreator();
  const { openPaywall, isLicensed } = usePaywall();
  const shouldOpenPaywall = () => !isLicensed() && settings.hotkeys.length > MAX_FREE_HOTKEYS;
  return (
    <Main>
      <KeyBindDialog onKeyBindUpdated={createHotKey} />
      <div>
        <Button class={"me-4"} onClick={() => navigate("/settings")}>
          <VsSettings size={23} />
          <p class={"ms-4"}>Settings</p>
        </Button>
        <Button onClick={openChromeExtension}>
          <IoExtensionPuzzleOutline size={20} />
          <p class={"ms-4"}>Get Chrome Extension</p>
        </Button>
      </div>
      <h1 class={"me-8 ms-2 my-8"}>
        KeyBinds
      </h1>
      <Show when={settings.hotkeys.length > 0} fallback={
        <div class={"flex flex-col justify-center items-center"}>
          <h2 class={"my-4"}>No hotkeys set!</h2>
          <Button size={"lg"} onClick={() => {
            if (shouldOpenPaywall())
              openPaywall();
            else
              openKeyBindDialog();
          }}>
            Create a new hotkey
          </Button>
        </div>
      }>
        <Button size={"lg"} class={"w-fit my-4"} onClick={() => {
          if (shouldOpenPaywall())
            openPaywall();
          else
            openKeyBindDialog();
        }}>
          Define new key
        </Button>
        <For each={settings.hotkeys}>{hotkey => (
          <HotKeyOptions hotkey={hotkey} />
        )}
        </For>
      </Show>
    </Main>
  );
}

function HotKeyOptions(props: { hotkey: HotKey }) {
  const { KeyBindDialog, openKeyBindDialog } = createKeyBindDialog(props.hotkey.id);
  const { updateHotKey, deleteHotKey } = createKeyBindController(props.hotkey.id);

  const {
    ConfirmationDialog: DeletionConfirmationDialog,
    openConfirmationDialog: openDeletionDialog,
  } = createConfirmationDialog(deleteHotKey);

  return (
    <Card class={"my-4 p-8 relative"}>

      <Button variant="destructive" onClick={openDeletionDialog}>
        <AiTwotoneDelete size={24} />
      </Button>

      <DeletionConfirmationDialog>
        Are you sure you want to delete this hotkey? This action cannot be undone!
      </DeletionConfirmationDialog>

      <div class="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <h3>Hot Key</h3>
        <DisplayKeyBind keyBind={props.hotkey.keybind} />
        <KeyBindDialog
          initialKeyBind={props.hotkey.keybind}
          onKeyBindUpdated={updateHotKey}
        />
        <Button onClick={openKeyBindDialog}>
          Change
        </Button>

      </div>

      <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <h3 class={"me-4"}>Action</h3>
        <VideoActionPicker hotkey={props.hotkey} />
      </div>
    </Card>
  );
}
