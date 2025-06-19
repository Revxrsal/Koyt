import {createResource} from "solid-js";
import {getVersion} from "@tauri-apps/api/app";
import { commands } from "~/gen/bindings";

export const [latestVersion] = createResource(getLatestVersion)
export const [isUpdateAvailable] = createResource(shouldUpdate, {initialValue: false})

export async function getLatestVersion(): Promise<string> {
  const latest = await commands.getLatestVersion()
  if (latest.status == "ok")
    return latest.data
  else
    return await getVersion()
}

export async function shouldUpdate() {
  const current = await getVersion()
  const latest = await getLatestVersion()
  return latest > current
}
