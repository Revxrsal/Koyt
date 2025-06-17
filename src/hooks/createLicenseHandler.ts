import { commands } from "~/gen/bindings";
import { showErrorToast, showSuccessToast } from "~/util/toaster";
import { useNavigate } from "@solidjs/router";
import { preferences, setPreferences } from "~/util/preferences";
import { popHistory } from "~/util/links";

export async function openLicenses() {
  await commands.openUrl("https://app.lemonsqueezy.com/my-orders/");
}

export async function openBuyPage() {
  await commands.openUrl("https://kbyoutube.com/pricing");
}

export function createLicenseHandler() {

  const navigate = useNavigate();

  async function inputLicense(licenseKey: string, instanceId: string) {
    const result = await commands.inputLicense(licenseKey, instanceId);
    if (result.status === "error") {
      showErrorToast("Error!", result.error);
      return;
    }
    if (!result.data) {
      showErrorToast("Error!", "Your license seems to be revoked. Please contact support.");
      return;
    }
    showSuccessToast("Success!", "Your license has been successfully activated! Enjoy the app :)");
    navigate("/home");
  }

  async function proceedWithFreeVersion() {
    setPreferences("license", "free");
    navigate("/home");
  }

  async function deactivateLicense() {
    const result = await commands.deactivateInstance();
    if (result.status === "error") {
      showErrorToast("Error!", result.error);
      return;
    }
    setPreferences("license", null);
    if (!preferences.license) {
      navigate("/");
      popHistory();
    }
  }

  return {
    inputLicense,
    proceedWithFreeVersion,
    deactivateLicense,
  };
}
