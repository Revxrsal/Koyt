import { Switch, SwitchControl, SwitchLabel, SwitchThumb } from "~/components/ui/switch";
import { preferences, setPreferences } from "~/util/preferences";
import { useSettings } from "~/util/settings";
import { Button } from "~/components/ui/button";
import { VsHome } from "solid-icons/vs";
import { useNavigate } from "@solidjs/router";

export default function Settings() {
  const [settings, setSettings] = useSettings();
  const navigate = useNavigate();
  const isSystemDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return (
    <main class={`min-h-screen flex flex-col p-4`}>
      <div>
        <Button onClick={() => navigate("/")}>
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
          checked={(preferences.theme === "dark") || (preferences.theme === "system" && isSystemDarkTheme)}
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

        <Switch
          checked={preferences.monoFont}
          onChange={v => setPreferences("monoFont", v)}
          class={"flex items-center"}
        >
          <SwitchControl class={"ms-4"}>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel
            class="text-lg ms-4 font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70"
          >
            Monospaced font
          </SwitchLabel>
        </Switch>

        <h2 class={"mt-8 font-bold"}>App</h2>

        <Switch
          checked={settings.launch_on_startup}
          onChange={v => setSettings("launch_on_startup", v)}
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

      </div>
    </main>
  );
}
