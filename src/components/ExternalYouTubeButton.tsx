import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "~/components/ui/dialog";
import {DialogTriggerProps} from "@kobalte/core/dialog";
import {Button} from "~/components/ui/button";
import Kbd from "~/components/Kbd";
import {TextField, TextFieldErrorMessage, TextFieldLabel, TextFieldRoot} from "~/components/ui/textfield";
import {createMemo, createSignal, Show} from "solid-js";
import {isURL} from "validator";
import {useLocation, useNavigate} from "@solidjs/router";
import {addEnterListener} from "~/util/keyboard";
import {createKeyBind} from "~/util/keyboard";

export default function ExternalOpenYouTubeButton() {
  const [openDialog, setOpenDialog] = createSignal(false)
  const [url, setURL] = createSignal<string>("");
  const isValid = createMemo(() => isURL(url()));
  const navigate = useNavigate();
  const loc = useLocation();

  function openYouTube() {
    localStorage.setItem("oxide_yt", url());
    if (loc.pathname === "/youtube") {
      window.location.reload();
    } else {
      navigate("/youtube")
    }
  }

  let openBtn: HTMLButtonElement | undefined;
  addEnterListener(() => openBtn)

  function B(props: any) {
    createKeyBind("y", () => setOpenDialog(true))
    return (
      <Button
        hotkey={"y"}
        class={"m-4"}
        {...props}
      >
        Open YouTube <Kbd>y</Kbd>
      </Button>
    )
  }

  return (
    <Dialog open={openDialog()} onOpenChange={setOpenDialog}>
      <DialogTrigger
        as={(props: DialogTriggerProps) => B(props)}
      />
      <DialogContent class="m-4 min-w-[83%]" onInteractOutside={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            Open YouTube URLs
          </DialogTitle>
        </DialogHeader>
        <TextFieldRoot class=" items-center gap-4 md:grid-cols-4" value={url()} onChange={setURL}
                       validationState={url().length == 0 ? undefined : isValid() ? "valid" : "invalid"}>
          <TextFieldLabel class="text-right">
            Video URL
          </TextFieldLabel>
          <TextField class="col-span-2 md:col-span-3" />
          <Show when={url().length != 0 && !isValid()}>
            <TextFieldErrorMessage class={"text-red-300 dark:text-red-300"}>Invalid URL</TextFieldErrorMessage>
          </Show>
        </TextFieldRoot>
        <DialogFooter class={"select-none"}>
          <Button
            type="submit"
            disabled={!isValid()}
            onClick={openYouTube}
            ref={v => openBtn = v}
          >
            Open
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
