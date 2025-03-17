import {createSignal, JSXElement, Show} from "solid-js";
import {DOMElement} from "solid-js/jsx-runtime";
import {Portal} from "solid-js/web";

export function createModal(opened: boolean = false) {
  const [show, setShow] = createSignal(opened)

  function handleDialogOverlay(event: MouseEvent & { currentTarget: HTMLDialogElement; target: DOMElement }) {
    if (event.target == event.currentTarget)
      setShow(false)
  }

  return {
    openModal: () => setShow(true),
    closeModal: () => setShow(false),
    Modal: (props: { children: JSXElement }) => (
      <Show when={show()}>
        <Portal>
          <dialog open={show()} onClick={handleDialogOverlay}>
            <article>
              {props.children}
            </article>
          </dialog>
        </Portal>
      </Show>
    )
  }
}