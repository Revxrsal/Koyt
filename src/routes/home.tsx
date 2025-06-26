import Main from "~/components/layout/Main";
import { For, onMount, Show } from "solid-js";
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
import { AiFillWarning, AiTwotoneDelete } from "solid-icons/ai";
import { openChromeExtension } from "~/util/links";
import { createHotKeyCreator, createKeyBindController } from "~/hooks/createKeyBindController";
import { IoExtensionPuzzleOutline } from "solid-icons/io";
import { MAX_FREE_HOTKEYS, usePaywall } from "~/hooks/usePaywall";
import { createFailedKeyBindsResource } from "~/hooks/createFailedKeyBindsResource";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card";
import { createConnectedClientsSignal } from "~/hooks/createConnectedClientsSignal";
import { ImConnection } from "solid-icons/im";
import { createUpdateChecker } from "~/hooks/createUpdateChecker";
import { isUpdateAvailable } from "~/hooks/createVersionChecker";
import { createFailedHostResource } from "~/hooks/createFailedHostResource";
import { BiSolidError } from "solid-icons/bi";
import { createHostRegistrationDialog } from "~/hooks/createHostRegistrationDialog";


export default function Home() {
  const navigate = useNavigate();
  const [settings] = useSettings();
  const { KeyBindDialog, openKeyBindDialog } = createKeyBindDialog();
  const { createHotKey } = createHotKeyCreator();
  const { openPaywall, isLicensed } = usePaywall();
  const [failedKeyBinds] = createFailedKeyBindsResource();
  const [failedToRegisterHost] = createFailedHostResource();
  const connectedClients = createConnectedClientsSignal();
  const { openUpdateDialog } = createUpdateChecker();
  const { openHostRegistrationDialog, dismissHostRegistrationError } = createHostRegistrationDialog();
  onMount(() => {
    if (isUpdateAvailable()) {
      openUpdateDialog();
    }
  });
  const shouldOpenPaywall = () => !isLicensed() && settings.hotkeys.length >= MAX_FREE_HOTKEYS;
  return (
    <Main>
      <KeyBindDialog onKeyBindUpdated={createHotKey} />
      <div>
        <Button class={"me-4"} onClick={() => navigate("/settings")}>
          <VsSettings size={23} />
          <p class={"ms-4"}>Settings</p>
        </Button>
        <Button class={"me-4"} onClick={openChromeExtension}>
          <IoExtensionPuzzleOutline size={20} />
          <p class={"ms-4"}>Get Chrome Extension</p>
        </Button>
        <Button variant={"outline"} class={"me-4 cursor-default"}>
          <ImConnection size={20} />
          <p class={"ms-4"}>Connected browsers: {connectedClients()}</p>
        </Button>
        <Show when={failedToRegisterHost() && !dismissHostRegistrationError()}>
          <Button variant={"destructive"} class={"me-4"} onClick={openHostRegistrationDialog}>
            <BiSolidError size={20} />
            <p class={"ms-4"}>Error</p>
          </Button>
        </Show>
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
          <HotKeyOptions hotkey={hotkey} error={failedKeyBinds()![hotkey.id]} />
        )}
        </For>
      </Show>
    </Main>
  );
}

function HotKeyOptions(props: { hotkey: HotKey, error?: string }) {
  const { KeyBindDialog, openKeyBindDialog } = createKeyBindDialog(props.hotkey.id);
  const { updateHotKey, deleteHotKey } = createKeyBindController(props.hotkey.id);

  const {
    ConfirmationDialog: DeletionConfirmationDialog,
    openConfirmationDialog: openDeletionDialog,
  } = createConfirmationDialog(deleteHotKey);

  return (
    <Card class={"my-4 p-8 relative"}>

      <Button variant="destructive" onClick={openDeletionDialog} class={"me-3"}>
        <AiTwotoneDelete size={24} />
      </Button>

      <Show when={props.error}>
        <HoverCard placement={"top"} openDelay={10} closeDelay={10}>
          <HoverCardTrigger>
            <Button variant={"outline"} class={"cursor-default"}>
              <AiFillWarning size={24} />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <h4>Failed to register this hotkey on startup.</h4>
            <hr class={"my-3"} />
            <p>Error: {props.error}</p>
          </HoverCardContent>
        </HoverCard>
      </Show>


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
