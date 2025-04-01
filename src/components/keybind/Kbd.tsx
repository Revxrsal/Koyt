import { ComponentProps, splitProps } from "solid-js";
import { cn } from "~/libs/cn";

export default function Kbd(props: ComponentProps<"kbd">) {
  const [local, rest] = splitProps(props, ["class"]);
  return <kbd
    class={cn(
      "text-lg border-2 p-4 m-2",
      local.class,
    )} {...rest} />;
}
