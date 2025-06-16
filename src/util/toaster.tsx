import { toaster } from "@kobalte/core";
import { Toast, ToastContent, ToastProgress, ToastTitle } from "~/components/ui/toast";

export function showErrorToast(title: string, message: string) {
  toaster.show(props => (
    <Toast toastId={props.toastId} variant={"destructive"}>
      <ToastContent>
        <ToastTitle>{title}</ToastTitle>
        <p>{message}</p>
      </ToastContent>
      <ToastProgress />
    </Toast>
  ));
}

export function showSuccessToast(title: string, message: string) {
  toaster.show(props => (
    <Toast toastId={props.toastId} duration={3000}>
      <ToastContent>
        <ToastTitle>{title}</ToastTitle>
        <p>{message}</p>
      </ToastContent>
      <ToastProgress />
    </Toast>
  ));
}
