import { Switch, SwitchControl, SwitchLabel, SwitchThumb } from "~/components/ui/switch";
import { preferences, setPreferences } from "~/util/preferences";
import { useSettings } from "~/util/settings";
import { Button } from "~/components/ui/button";
import { VsHome } from "solid-icons/vs";
import { useNavigate } from "@solidjs/router";
import Main from "~/components/layout/Main";
import { createDarkThemeQuery } from "~/hooks/createDarkThemeQuery";
import {
  Select,
  SelectContent,
  SelectHiddenSelect,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { createFontsResource } from "~/hooks/createFontsResource";
import { createResource, onMount, Show } from "solid-js";
import { AiFillCrown } from "solid-icons/ai";
import { createLicenseHandler } from "~/hooks/createLicenseHandler";
import { popHistory } from "~/util/links";
import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { appDataDir, appLocalDataDir } from "@tauri-apps/api/path";
import { commands } from "~/gen/bindings";
import { showErrorToast } from "~/util/toaster";
import { usePaywall } from "~/hooks/usePaywall";

function RevealableFilePath(props: { path: string }) {
  async function reveal() {
    const res = await commands.revealFile(props.path);
    if (res.status === "error") {
      showErrorToast("Error!", `Failed to reveal path: ${res.error}`);
    }
  }

  return (
    <span class={"underline cursor-pointer"} role={"link"} onClick={reveal}>{props.path}</span>
  );
}

export default function Settings() {

  const [settings, setSettings] = useSettings();
  const navigate = useNavigate();
  const isSystemDarkTheme = createDarkThemeQuery();
  const [systemFonts] = createFontsResource();
  const { deactivateLicense } = createLicenseHandler();

  const [appVersion] = createResource(getVersion);
  const [tauriVersion] = createResource(getTauriVersion);
  const [appData] = createResource(async () => (await appDataDir()).replaceAll("\\", "/"));
  const [localAppData] = createResource(async () => (await appLocalDataDir()).replaceAll("\\", "/"));
  const { openPaywall, isLicensed } = usePaywall();

  onMount(async () => {
    if (!preferences.license) {
      navigate("/");
      popHistory();
    }
  });
  return (
    <Main>
      <div>
        <Button onClick={() => navigate("/home")}>
          <VsHome size={23} />
          <p class={"ms-4"}>Home</p>
        </Button>
      </div>
      <h1 class={"my-8 text-center"}>
        Settings
      </h1>
      <div class={"flex flex-col"}>
        <h2 class={"mb-4 font-bold"}>Appearance</h2>
        <Switch
          checked={(preferences.theme === "dark") || (preferences.theme === "system" && isSystemDarkTheme())}
          onChange={v => setPreferences("theme", v ? "dark" : "light")}
          class={"flex items-center mb-8"}
        >
          <SwitchControl class={"ms-4"}>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel
            class="text-lg ms-4 font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70"
          >
            Dark Mode
          </SwitchLabel>
        </Switch>

        <label class={"my-2"} for="fonts">Font</label>
        <Select
          // @ts-ignore
          onKeyDown={event => {
            event.target?.scrollIntoView({ block: "nearest" });
          }}
          name="fonts"
          placement={"bottom"}
          value={preferences.appFont}
          onChange={font => setPreferences("appFont", font)}
          options={systemFonts()}
          optionValue={v => v}
          optionTextValue={v => v}
          itemComponent={props => {
            const font = props.item.textValue;
            return (
              <SelectItem
                item={props.item}
                aria-label={props.item.rawValue}
                style={{ "font-family": font }}
              >
                {props.item.rawValue}
              </SelectItem>
            );
          }}
        >
          <SelectHiddenSelect />
          <SelectTrigger class={"w-[250px]"}>
            <SelectValue<string>>{state => state.selectedOption()}</SelectValue>
          </SelectTrigger>
          <SelectContent class="max-h-[250px] w-[250px] overflow-auto" />
        </Select>

        <h2 class={"mt-8 font-bold"}>App</h2>

        <Switch
          checked={settings.launch_on_startup}
          onChange={v => {
            if (isLicensed())
              setSettings("launch_on_startup", v);
            else
              openPaywall();
          }}
          class={"flex items-center my-8"}
        >
          <SwitchControl class={"ms-4"}>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel
            class="text-lg ms-4 font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70"
          >
            Run on startup
          </SwitchLabel>
        </Switch>

        <Switch
          checked={settings.minimize_to_tray_on_close}
          onChange={v => setSettings("minimize_to_tray_on_close", v)}
          class={"flex items-center mb-8"}
        >
          <SwitchControl class={"ms-4"}>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel
            class="text-lg ms-4 font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70"
          >
            Minimize to tray when closed
          </SwitchLabel>
        </Switch>

        <h2 class={"mb-4 font-bold"}>License</h2>
        <div class={"flex flex-row items-center"}>
          <p class={"capitalize text-xl"}>
            <strong>Type: </strong> {preferences.license}
          </p>
          <Show when={preferences.license === "paid"}>
            <AiFillCrown class={"mx-2"} size={24} />
          </Show>
        </div>

        <Show when={preferences.license === "paid"} fallback={
          <Button class={"w-fit my-4"} onClick={() => navigate("/inputLicense")}>
            Activate a license
          </Button>
        }>
          <Button class={"w-fit my-4"} onClick={deactivateLicense}>
            Deactivate license
          </Button>
        </Show>


        <h2 class={"mt-4 font-bold"}>Debug info</h2>
        <p class={"text-xl my-2"}>
          <strong>App version: </strong> {appVersion()}
        </p>
        <p class={"text-xl my-2"}>
          <strong>Tauri version: </strong> {tauriVersion()}
        </p>
        <p class={"text-xl my-2"}>
          <strong>App data directory: </strong> <RevealableFilePath path={appData() || ""} />
        </p>

        <p class={"text-xl my-2"}>
          <strong>Local app data directory: </strong> <RevealableFilePath path={localAppData() || ""} />
        </p>

      </div>
    </Main>
  );
}
