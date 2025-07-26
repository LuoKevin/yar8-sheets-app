import { JSX } from "react"
import { ToastIcons } from "../components/SimpleToast"

export enum FetchStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export function typeToToastIcon(type: string): JSX.Element {
    switch(type) {
        case('success'):
            return ToastIcons.success
        case('error'):
            return ToastIcons.error
        case('warning'):
            return ToastIcons.warning
        default:
            return ToastIcons.info
    }
}
