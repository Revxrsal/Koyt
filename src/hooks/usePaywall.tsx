import { render } from "solid-js/web";
import { createSignal } from "solid-js";
import { preferences } from "~/util/preferences";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import { openBuyPage } from "~/hooks/createLicenseHandler";

export const MAX_FREE_HOTKEYS = 1;

const paywall = createNewPaywall();

export function usePaywall() {
  return paywall;
}


function createNewPaywall() {
  const [open, setOpen] = createSignal(false);
  render(() => (
    <PaywallDialog open={open()} setOpen={setOpen} />
  ), document.body);
  return {
    openPaywall: () => setOpen(true),
    isLicensed: () => preferences.license === "paid",
  };
}

function PaywallDialog(props: { open: boolean, setOpen: (open: boolean) => void }) {
  return (
    <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <h3>
            Pls pay
          </h3>
        </AlertDialogHeader>
        <AlertDialogFooter class={"flex"}>
          <AlertDialogClose>
            Cancel
          </AlertDialogClose>
          <AlertDialogAction onClick={openBuyPage}>
            That sounds exciting
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
