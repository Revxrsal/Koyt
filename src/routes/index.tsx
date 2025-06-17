import { useNavigate } from "@solidjs/router";
import { createResource, onMount } from "solid-js";
import Main from "~/components/layout/Main";
import { Grid } from "solid-spinner";
import { commands } from "~/gen/bindings";
import { preferences } from "~/util/preferences";
import { showErrorToast } from "~/util/toaster";

const [puffColor] = createResource(async () => {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  const foreground = computedStyle.getPropertyValue("--primary-foreground").trim();
  return `hsl(${foreground})`;
}, { initialValue: "hsl(0,0%,87%)" });

function createBars() {
  const width = window.innerWidth / 25;
  return {
    LoadingBars: () => (
      <Grid color={puffColor()} width={width} height={width} />
    ),
  };
}

export default function Index() {
  const navigate = useNavigate();
  const { LoadingBars } = createBars();
  onMount(async () => {
    if (!preferences.license) {
      navigate("/inputLicense");
      console.log("License == null");
      return;
    } else if (preferences.license === "free") {
      navigate("/home");
      console.log("License == free");
      return;
    } else {
      const hasLicense = await commands.hasLicense();
      if (hasLicense.status === "error") {
        console.log("hasLicense failed");
        showErrorToast("Error!", "Failed to check if you have a license or not :(");
        navigate("/inputLicense");
        return;
      }
      const renew = await commands.renewAppLicense();
      if (renew.status === "error" || !renew.data) {
        console.log("renewAppLicense failed");
        showErrorToast("Error!", "Failed to refresh your license :(");
        navigate("/inputLicense");
        return;
      }
      console.log("License is valid");
      navigate("/home");
    }
    // if (hasLicense.status === 'ok')
    // }
  });
  return (
    <Main class={"justify-center items-center"}>
      <LoadingBars />
    </Main>
  );
}
