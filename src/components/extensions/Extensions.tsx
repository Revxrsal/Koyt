import {DialogTriggerProps} from "@kobalte/core/dialog";
import {Button} from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import {TextField, TextFieldErrorMessage, TextFieldLabel, TextFieldRoot} from "../ui/textfield";
import {createMemo, createSignal, For, Show} from "solid-js";
import {isURL} from "validator";
import {BrowserExtension, commands} from "~/gen/bindings";
import {useSettings} from "~/util/settings";
import {getChromeVersion, getNaclArch} from "~/util/browserExtensions";
import {Skeleton} from "~/components/ui/skeleton";
import {unwrap} from "solid-js/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "../ui/alert-dialog";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {Switch, SwitchControl, SwitchLabel, SwitchThumb} from "~/components/ui/switch";

function DisplayExtension(props: { extension: BrowserExtension, index: number }) {
  const [_, setSettings] = useSettings()
  return (
    <Card class={"flex flex-col items-start justify-start my-4 "}>
      <CardHeader>
        <CardTitle class={"font-bold"}>{props.extension.name}</CardTitle>
      </CardHeader>
      <CardContent class={"text-muted-foreground"}>
        {props.extension.description}
      </CardContent>
      <CardFooter class={"flex flex-row w-full justify-between "}>
        <Switch
          class="flex items-center space-x-2"
          checked={props.extension.enabled}
          onChange={async (e) => {
            setSettings("downloaded_extensions", props.index, "enabled", e);
            await commands.setExtensionEnabled(props.extension.name, e)
          }}
        >
          <SwitchControl class={"direction-ltr"}>
            <SwitchThumb/>
          </SwitchControl>
          <SwitchLabel class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70">
            Enabled
          </SwitchLabel>
        </Switch>
        <RemoveExtensionButton extension={props.extension}/>
      </CardFooter>
    </Card>
  );
}

export default function Extensions() {
  const [settings] = useSettings();
  return (
    <div class={"flex flex-col justify-center mt-8"}>
      <h2 class={"font-bold text-center"}>Extensions</h2>
      <div class="flex flex-col justify-center ">
        <AddExtensionButton/>
        <For each={settings.downloaded_extensions}>{(extension, index) => (
          <DisplayExtension extension={extension} index={index()}/>
        )}</For>
      </div>
    </div>
  )
}

function RemoveExtensionButton(props: { extension: BrowserExtension }) {
  const [, setSettings] = useSettings()

  async function remove() {
    setSettings("downloaded_extensions", v => v.filter(i => i.id != props.extension.id))
    await commands.removeExtension(props.extension.name)
    window.location.reload()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button>
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the extension as well as all your previous data on it (probably!)
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose>Cancel</AlertDialogClose>
          <AlertDialogAction onClick={remove}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function InstallModalContent(props: { onClose: () => void }) {
  const [url, setURL] = createSignal("")
  const [settings, setSettings] = useSettings();
  const [downloading, setDownloading] = createSignal(false)
  const [error, setError] = createSignal("")

  const isValid = createMemo(() => isURL(url()) && url().startsWith("https://chromewebstore.google.com/detail/") && error() == "")

  async function add() {
    setDownloading(true)
    try {
      const extension = await commands.downloadExtension(url(), getChromeVersion(), getNaclArch())
      setDownloading(false)
      props.onClose()
      const index = settings.downloaded_extensions.findIndex(v => v.id == extension.id);
      if (index != -1) {
        setSettings("downloaded_extensions", index, {
          enabled: true,
          description: extension.description,
          version: extension.version,
        })
      } else {
        setSettings("downloaded_extensions", v => [...v, extension])
      }
      window.location.reload()
    } catch (e) {
      setDownloading(false)
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError(e as string)
      }
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          Add browser extensions
        </DialogTitle>
        <DialogDescription>
          Install browser extensions to the video player. Supports extensions from the Chrome Webstore.
        </DialogDescription>
      </DialogHeader>
      <div class="py-4">
        <TextFieldRoot class="items-center gap-4 md:grid-cols-4" validationState={
          url().length == 0 ? undefined : isValid() ? "valid" : "invalid"
        }>
          <TextFieldLabel class="text-right">
            Chrome Webstore Extension URL
          </TextFieldLabel>
          <TextField value={url()}
                     onInput={(e: { currentTarget: { value: string; }; }) => {
                       setURL(e.currentTarget.value)
                       setError("")
                     }}
                     class="col-span-2 md:col-span-3"
                     placeholder={"https://chromewebstore.google.com/detail/..."}
          />
          <Show when={error().length != 0}>
            <TextFieldErrorMessage>Error: {error()}</TextFieldErrorMessage>
          </Show>
          <Show when={url().length != 0 && error().length == 0 && !isValid()}>
            <TextFieldErrorMessage class={"text-red-300 dark:text-red-300"}>Invalid URL</TextFieldErrorMessage>
          </Show>
        </TextFieldRoot>
        <Show when={downloading()}>
          <Skeleton class="h-4 my-4"/>
        </Show>
        <p>
          <small>
            <strong>Note</strong>: Extensions that are designed to include any UI interactions (e.g. icon, badge, pop
            up, etc.) can be loaded and used but will have missing UI entry points due to the lack of browser UI
            elements
            to host these entry points in the video player.
          </small>
        </p>
      </div>
      <DialogFooter class={"select-none"}>
        <Button type="submit" disabled={!isValid() || downloading()} onClick={add}>Install</Button>
      </DialogFooter>
    </>
  )
}

function AddExtensionButton() {
  const [opened, setOpened] = createSignal(false)

  return (
    <Dialog open={opened()} onOpenChange={setOpened}>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button class={""} {...props}>
            Add extension
          </Button>
        )}
      />
      <DialogContent class="m-4 min-w-[83%]" onInteractOutside={e => e.preventDefault()}>
        <InstallModalContent onClose={() => setOpened(false)}/>
      </DialogContent>
    </Dialog>
  )
}