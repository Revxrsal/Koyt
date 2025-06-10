import { createStore, unwrap } from "solid-js/store";
import { createEffect } from "solid-js";
import { trackDeep } from "~/deep";
import { useColorMode } from "@kobalte/core/color-mode";

export const [preferences, setPreferences] = createStore<Preferences>(loadPreferences());

export interface Preferences {
  theme: "dark" | "light" | "system";
  monoFont: boolean;
}

function createDefaultPreferences(): Preferences {
  return { theme: "system", monoFont: false };
}

function loadPreferences(): Preferences {
  const prefs = localStorage.getItem("koyt.preferences");
  if (prefs === null)
    return createDefaultPreferences();
  return JSON.parse(prefs);
}

export function addPreferencesEffect() {
  const value = useColorMode();
  createEffect(() => {
    trackDeep(preferences);
    localStorage.setItem("koyt.preferences", JSON.stringify(unwrap(preferences)));
    value.setColorMode(preferences.theme);

    if (preferences.monoFont)
      document.getElementsByTagName("html")[0].style.fontFamily = "'JetBrains Mono', monospace";
    else
      document.getElementsByTagName("html")[0].style.fontFamily = "'Readex Pro', serif";
  });
}
