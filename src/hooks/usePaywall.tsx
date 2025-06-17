import { render } from "solid-js/web";
import { Dialog, DialogContent, DialogHeader } from "~/components/ui/dialog";
import { createSignal } from "solid-js";
import { preferences } from "~/util/preferences";

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
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent>
        <DialogHeader>Hi</DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
