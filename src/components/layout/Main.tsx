import { ComponentProps, splitProps } from "solid-js";
import { cn } from "~/libs/cn";

export default function Main(props: ComponentProps<"main">) {
  const [local, mainProps] = splitProps(props, ["class"]);
  return (
    <main class={cn(`min-h-screen flex flex-col p-4`, local.class)} {...mainProps} />
  );
}
