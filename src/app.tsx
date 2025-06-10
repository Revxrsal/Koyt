import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { JSXElement, Suspense } from "solid-js";
import "./app.css";
import { ColorModeProvider, ColorModeScript } from "@kobalte/core";
import { createSettingsProvider } from "~/util/settings";
import { addPreferencesEffect } from "~/util/preferences";

function C(props: { children: JSXElement }) {
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
                <C>{props.children}</C>
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
