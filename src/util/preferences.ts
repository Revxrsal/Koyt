import { createStore, unwrap } from "solid-js/store";
import { createEffect } from "solid-js";
import { trackDeep } from "~/deep";
import { useColorMode } from "@kobalte/core/color-mode";

export const [preferences, setPreferences] = createStore<Preferences>(loadPreferences());

export interface Preferences {
  theme: "dark" | "light" | "system";
  appFont: string | null;
}

function createDefaultPreferences(): Preferences {
  return { theme: "system", appFont: null };
}

function loadPreferences(): Preferences {
  const prefs = localStorage.getItem("kbyoutube.preferences");
  if (prefs === null)
    return createDefaultPreferences();
  return JSON.parse(prefs);
}

export function addPreferencesEffect() {
  const value = useColorMode();
  createEffect(() => {
    trackDeep(preferences);
    localStorage.setItem("kbyoutube.preferences", JSON.stringify(unwrap(preferences)));
    value.setColorMode(preferences.theme);

    if (preferences.appFont)
      document.getElementsByTagName("html")[0].style.fontFamily = `'${preferences.appFont}', fallback, sans-serif`;
    else
      document.getElementsByTagName("html")[0].style.fontFamily = "system-ui";
  });
}
