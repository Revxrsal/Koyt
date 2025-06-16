import { commands, HotKey, KeyBind } from "~/gen/bindings";
import { uid } from "~/util/uid";
import { unwrapResult } from "~/util/results";

const FUNCTION_KEYS = ["Control", "Alt", "Meta", "Shift"];

export function isFunctionKey(key: string) {
  return FUNCTION_KEYS.includes(key);
}

export function isKeyBindEmpty(keyBind: KeyBind): boolean {
  return !(keyBind.alt || keyBind.ctrl || keyBind.key || keyBind.meta || keyBind.shift);
}

export function createEmptyKeyBind(): KeyBind {
  return { alt: false, meta: false, ctrl: false, key: "", shift: false };
}

export function createSampleKeyBind(): KeyBind {
  return { alt: false, meta: false, ctrl: true, key: "C", shift: true };
}

export function createEmptyHotKey(): HotKey {
  return { id: uid(), keybind: createEmptyKeyBind(), video_action: { Playing: "Toggle" } };
}

export async function toGlobalShortcut(keyBind: KeyBind) {
  return unwrapResult(await commands.toTauriGlobalShortcut(keyBind));
}

