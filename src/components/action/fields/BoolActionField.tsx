import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { BoolAction } from "~/gen/bindings";

export default function BoolActionField(props: {
  value: BoolAction;
  setValue: (value: BoolAction) => void;
}) {
  return (
    <Select<BoolAction>
      class={"min-w-44"}
      value={props.value}
      defaultValue={"Toggle"}
      onChange={(e) => {
        if (e) props.setValue(e);
      }}
      options={["Toggle", "Enable", "Disable"]}
      itemComponent={props =>
        <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
      }
    >
      <SelectTrigger>
        <SelectValue<BoolAction>>{state =>
          state.selectedOption()
        }</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
}
