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
          <h2 class={"text-center"}>
            Engage full power. Suit up! 🤖
          </h2>
          <h4 class={"text-center"}>
            Unlock this feature with the premium version
          </h4>
        </AlertDialogHeader>
        <div class={"mx-2"}>
          <ul>
            <li class={"my-4"}>⌨️ <strong>Unlimited Hotkeys</strong> – Set up as many global shortcuts as you need</li>
            <li class={"my-4"}>💻 <strong>Launch on Startup</strong> – Start the app automatically with your system</li>
            <li class={"my-4"}>🪙 <strong>One-Time Purchase</strong> – No subscriptions, no hidden fees</li>
            <li class={"my-4"}>🔒 <strong>30-Day Guarantee</strong> – Love it or get a full refund, no questions asked
            </li>
            <li class={"my-4"}>⭐ <strong>Priority Support</strong> – Jump the line with VIP email assistance</li>
            <li class={"my-4"}>💖 <strong>Support the Project</strong> – Help keep indie software alive and thriving</li>
          </ul>
        </div>
        <AlertDialogFooter class={"flex"}>
          <AlertDialogClose>
            Uh no, thanks
          </AlertDialogClose>
          <AlertDialogAction onClick={openBuyPage}>
            That sounds exciting!!
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
