import { Switch, SwitchControl, SwitchLabel, SwitchThumb } from "~/components/ui/switch";
import { preferences, setPreferences } from "~/util/preferences";
import { useSettings } from "~/util/settings";
import { Button } from "~/components/ui/button";
import { VsHome } from "solid-icons/vs";
import { useNavigate } from "@solidjs/router";
import Main from "~/components/layout/Main";
import { createDarkThemeQuery } from "~/hooks/createDarkThemeQuery";
import { getSystemFonts } from "~/font/SystemFonts";
import { createEffect, createResource } from "solid-js";
import {
  Select,
  SelectContent,
  SelectHiddenSelect,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function Settings() {
  const [settings, setSettings] = useSettings();
  const navigate = useNavigate();
  const isSystemDarkTheme = createDarkThemeQuery();
  const [systemFonts] = createResource(getSystemFonts, { initialValue: [] });
  return (
    <Main>
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
        {/*<Switch*/}
        {/*  checked={preferences.monoFont}*/}
        {/*  onChange={v => setPreferences("monoFont", v)}*/}
        {/*  class={"flex items-center"}*/}
        {/*>*/}
        {/*  <SwitchControl class={"ms-4"}>*/}
        {/*    <SwitchThumb />*/}
        {/*  </SwitchControl>*/}
        {/*  <SwitchLabel*/}
        {/*    class="text-lg ms-4 font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70"*/}
        {/*  >*/}
        {/*    Monospaced font*/}
        {/*  </SwitchLabel>*/}
        {/*</Switch>*/}

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
    </Main>
  );
}
