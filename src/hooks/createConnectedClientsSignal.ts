import { createSignal, onCleanup, onMount } from "solid-js";
import { events } from "~/gen/bindings";

export function createConnectedClientsSignal() {
  const [value, setValue] = createSignal(0);
  onMount(async () => {
    const u1 = await events.clientConnectedEvent.listen(({ payload }) => {
      setValue(payload.total_count);
    });
    const u2 = await events.clientDisconnectedEvent.listen(({ payload }) => {
      setValue(payload.total_count);
    });
    onCleanup(() => {
      u1();
      u2();
    });
  });
  return value;
}
