import { createStore, unwrap } from "solid-js/store";
import { createEffect } from "solid-js";
import { trackDeep } from "~/deep";
import { useColorMode } from "@kobalte/core/color-mode";

export const [preferences, setPreferences] = createStore<Preferences>(loadPreferences());

export interface Preferences {
  license: "free" | "paid" | null;
  theme: "dark" | "light" | "system";
  appFont: string | null;
  dismissHostRegistrationWarning: boolean;
}

function createDefaultPreferences(): Preferences {
  return { license: null, theme: "system", appFont: "Poppins", dismissHostRegistrationWarning: false };
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
      document.getElementsByTagName("html")[0].style.fontFamily = `'${preferences.appFont}', sans-serif`;
    else
      document.getElementsByTagName("html")[0].style.fontFamily =
        "system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif";
  });
}
