import Main from "~/components/layout/Main";
import {
  TextField,
  TextFieldDescription,
  TextFieldErrorMessage,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import { createMemo, createSignal, Show } from "solid-js";
import { isUUID } from "validator";
import { cn } from "~/libs/cn";
import { Button } from "~/components/ui/button";
import { createLicenseHandler, openBuyPage, openLicenses } from "~/hooks/createLicenseHandler";

function createLicenseKeyField() {
  const [licenseKey, setLicenseKey] = createSignal("");
  const isKeyUUID = createMemo(() => isUUID(licenseKey()));
  return {
    licenseKey,
    LicenseKeyField: (props: { class?: string }) => (
      <TextFieldRoot
        class={cn("w-full max-w-xs", props.class)}
        value={licenseKey()}
        onChange={setLicenseKey}
        validationState={(isKeyUUID() || licenseKey().length === 0) ? "valid" : "invalid"}
      >
        <TextFieldLabel>License key</TextFieldLabel>
        <TextField placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" />
        <TextFieldDescription>
          The license key. You should have received
          it in email if you had purchased a license.
          <span class={"font-bold underline ms-1 cursor-pointer"} role={"link"} onClick={openLicenses}>Got one?</span>
        </TextFieldDescription>
        <Show when={!isKeyUUID()}>
          <TextFieldErrorMessage>Invalid license key</TextFieldErrorMessage>
        </Show>
      </TextFieldRoot>
    ),
    isLicenceKeyValid: () => isKeyUUID(),
  };
}

function createInstanceField() {
  const [instanceId, setInstanceId] = createSignal("");
  return {
    instanceId,
    InstanceIdField: (props: { class?: string }) => (
      <TextFieldRoot
        class={cn("w-full max-w-xs", props.class)}
        value={instanceId()}
        onChange={setInstanceId}
      >
        <TextFieldLabel>Device name</TextFieldLabel>
        <TextField placeholder="Bob's PC" />
        <TextFieldDescription>
          Any name to help you identify the device you are running
          the app on. Nothing special
        </TextFieldDescription>
      </TextFieldRoot>
    ),
    isInstanceIdValid: () => instanceId().length > 0,
  };
}

export default function InputLicense() {
  const { LicenseKeyField, licenseKey, isLicenceKeyValid } = createLicenseKeyField();
  const { InstanceIdField, instanceId, isInstanceIdValid } = createInstanceField();
  const { inputLicense, proceedWithFreeVersion, isSubmitting } = createLicenseHandler();
  const canSubmit = createMemo(() => isLicenceKeyValid() && isInstanceIdValid());

  return (
    <Main class={"justify-center items-center"}>
      <h1 class={"my-8"}>Welcome back!</h1>
      <div class={"flex flex-col"}>
        <LicenseKeyField class={"my-4 mb-2"} />
        <InstanceIdField class={"my-4 mb-4"} />
        <Button class={"mt-2"} disabled={!canSubmit() || isSubmitting()} onClick={() => inputLicense(licenseKey(), instanceId())}>
          Proceed
        </Button>
        <hr class={"mt-4 mb-2"} />
        <Button variant={"secondary"} class={"mt-2 w-full me-2"} onClick={openBuyPage}>
          Buy a license
        </Button>
        <Button variant={"ghost"} class={"mt-2"} onClick={proceedWithFreeVersion}>
          Proceed with free version
        </Button>
      </div>
    </Main>
  );
}
