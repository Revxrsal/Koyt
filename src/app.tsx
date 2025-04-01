import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { ColorModeProvider, ColorModeScript } from "@kobalte/core";
import { createSettingsProvider } from "~/util/settings";

export default function App() {
  const { SettingsProvider } = createSettingsProvider();
  return (
    <Router
      root={props => (
        <>
          <Suspense>
            <SettingsProvider>
              <ColorModeScript />
              <ColorModeProvider>
                {/*<ContextMenu>*/}
                  {/*<ContextMenuTrigger>*/}
                    {props.children}
                  {/*</ContextMenuTrigger>*/}
                {/*</ContextMenu>*/}
              </ColorModeProvider>
            </SettingsProvider>
          </Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
