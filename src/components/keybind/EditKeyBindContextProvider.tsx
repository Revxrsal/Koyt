import { KeyBind } from "~/gen/bindings";
import { Context, createContext, JSXElement, useContext } from "solid-js";
import { SetStoreFunction, Store } from "solid-js/store";

const EditKeyBindContext: Context<[get: Store<KeyBind>, set: SetStoreFunction<KeyBind>] | undefined> = createContext();

export function useEditKeyBind() {
  const value = useContext(EditKeyBindContext);
  if (value === undefined) {
    throw new Error("No keybind editing context");
  }
  return value;
}

export default function EditKeyBindContextProvider(props: {
  keyBind: ReturnType<typeof useEditKeyBind>,
  children: JSXElement
}) {
  return <EditKeyBindContext.Provider value={props.keyBind}>
    {props.children}
  </EditKeyBindContext.Provider>;
}
