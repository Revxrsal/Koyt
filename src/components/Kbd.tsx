import {JSXElement} from "solid-js";

export default function Kbd(props: { children: JSXElement }) {
  return (
    <kbd
      class="pointer-events-none inline-flex h-5 select-none items-center gap-1 ms-4 rounded border px-1.5 font-mono text-[10px] font-medium text-muted opacity-100">
      {props.children}
    </kbd>
  )
}
