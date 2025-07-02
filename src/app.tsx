import "./app.css";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { createResource, JSXElement, Suspense } from "solid-js";
import { ColorModeProvider, ColorModeScript } from "@kobalte/core";
import { createSettingsProvider } from "~/util/settings";
import { addPreferencesEffect, preferences } from "~/util/preferences";
import { ToastList, ToastRegion } from "~/components/ui/toast";
import { Toaster } from "~/components/ui/sonner";
import { commands } from "~/gen/bindings";

export const [isMicrosoftVersion] = createResource(commands.isMicrosoftVersion, {initialValue: false});

function AppWrapper(props: { children: JSXElement }) {
  addPreferencesEffect();
  return props.children;
}

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
                <AppWrapper>{props.children}</AppWrapper>
                <Toaster theme={preferences.theme} />
                <ToastRegion>
                  <ToastList />
                </ToastRegion>
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
