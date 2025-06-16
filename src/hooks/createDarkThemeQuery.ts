import { createMediaQuery } from "@solid-primitives/media";

export function createDarkThemeQuery() {
  return createMediaQuery("(prefers-color-scheme: dark)", true);
}
