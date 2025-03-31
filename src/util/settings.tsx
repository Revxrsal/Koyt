import {createContext, createEffect, JSXElement, useContext} from "solid-js";
import {createStore, SetStoreFunction, unwrap} from "solid-js/store";
import {AppSettings, commands} from "~/gen/bindings";
import {trackDeep} from "~/deep";

const SettingsContext = createContext<[AppSettings, SetStoreFunction<AppSettings>]>()

export function createEmptySettings(): AppSettings {
  return {
    downloaded_extensions: []
  }
}

export function useSettings() {
  return useContext(SettingsContext) || createStore(createEmptySettings());
}

export function createSettingsProvider() {
  const [settings, setSettings] = createStore(createEmptySettings())

  queueMicrotask(async () => {
    const appSettings = await commands.getSettings()
    setSettings(appSettings)
  })

  createBackendListener(settings)

  return {
    SettingsProvider: (props: { children: JSXElement }) => (
      <SettingsContext.Provider value={[settings, setSettings]} children={props.children}/>
    )
  }
}

function createBackendListener(settings: AppSettings) {
  let first = true;
  let updateFromBackend = false;
  createEffect(async () => {
    trackDeep(settings);
    if (!updateFromBackend) {
      /* update wasn't from backend. send the update to the backend */
      if (settings) {
        if (first)
          first = false
        else
          await commands.setSettings(unwrap(settings))
      }
    } else {
      /*
        update was from backend. we already updated our settings in
        the listener above. just toggle the boolean.
       */
      updateFromBackend = false;
    }
  })
}
