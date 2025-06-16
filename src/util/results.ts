import { Result } from "~/gen/bindings";

export function unwrapResult<T>(result: Result<T, any>): T {
  if (result.status === "error")
    throw new Error(String(result.error));
  return result.data;
}
