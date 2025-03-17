export default function ShtCt(props: { label: string, shortcut: string }) {
  return (
    <li class={"list-disc w-full flex items-center flex-row justify-between my-2"}>
      <span class={"font-semibold"}>{props.label}</span>
      <kbd class={"font-normal text-sm bg-muted px-1.5 ms-12 py-1.5 rounded shadow-2xl"}>{props.shortcut}</kbd>
    </li>
  )
}
