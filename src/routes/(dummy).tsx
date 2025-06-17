import { useNavigate } from "@solidjs/router";
import { createResource, onMount } from "solid-js";
import Main from "~/components/layout/Main";
import { commands } from "~/gen/bindings";
import { preferences } from "~/util/preferences";
import { showErrorToast } from "~/util/toaster";
import { Puff } from "solid-spinner";

const [foregroundColor] = createResource(async () => {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  const foreground = computedStyle.getPropertyValue("--primary-foreground").trim();
  return `hsl(${foreground})`;
}, { initialValue: "hsl(0,0%,87%)" });

function LoadingIndicator() {
  const width = window.innerWidth / 25;
  return <Puff color={foregroundColor()} width={width} height={width} />;
}

export default function Index() {
  const navigate = useNavigate();
  onMount(async () => {
    if (!preferences.license) {
      navigate("/inputLicense");
      return;
    } else if (preferences.license === "free") {
      navigate("/home");
      return;
    } else {
      const hasLicense = await commands.hasLicense();
      if (hasLicense.status === "error") {
        showErrorToast("Error!", "Failed to check if you have a license or not :(");
        navigate("/inputLicense");
        return;
      }
      const renew = await commands.renewAppLicense();
      if (renew.status === "error" || !renew.data) {
        showErrorToast("Error!", "Failed to refresh your license :(");
        navigate("/inputLicense");
        return;
      }
      navigate("/home");
    }
  });
  return (
    <Main class={"justify-center items-center"}>
      <LoadingIndicator />
    </Main>
  );
}
