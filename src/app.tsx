import {Router} from "@solidjs/router";
import {FileRoutes} from "@solidjs/start/router";
import {onMount, Suspense} from "solid-js";
import "./app.css";
import "./plyr.css";
import {ColorModeProvider, ColorModeScript} from "@kobalte/core";
import {createSettingsProvider} from "~/util/settings";
import {addF11Listener} from "~/util/fullscreen";

export default function App() {
  const {SettingsProvider} = createSettingsProvider()
  onMount(addF11Listener)
  return (
    <Router
      root={props => (
        <>
          <Suspense>
            <SettingsProvider>
              <ColorModeScript/>
              <ColorModeProvider>
                {props.children}
              </ColorModeProvider>
            </SettingsProvider>
          </Suspense>
        </>
      )}
    >
      <FileRoutes/>
    </Router>
  );
}
