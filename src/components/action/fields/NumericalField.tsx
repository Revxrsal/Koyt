import { NumberFieldRootProps } from "@kobalte/core/number-field";
import {
  NumberField,
  NumberFieldDecrementTrigger,
  NumberFieldGroup, NumberFieldIncrementTrigger,
  NumberFieldInput,
} from "~/components/ui/number-field";

export default function NumericalField(props: Omit<NumberFieldRootProps, "onRawValueChange"> & { setValue: (val: number) => void }) {
  return (
    <NumberField
      onRawValueChange={props.setValue}
      {...props}
    >
      <NumberFieldGroup>
        <NumberFieldDecrementTrigger aria-label="Decrement" />
        <NumberFieldInput />
        <NumberFieldIncrementTrigger aria-label="Increment" />
      </NumberFieldGroup>
    </NumberField>
  );
}
