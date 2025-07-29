import { use, useState } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export const useToast = () => {
  const [toastMessage, setToastMessage] = useState<string>('') // Just stores the message string
  const [toastStatus, setToastStatus] = useState<string>('info')

  const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    setToastMessage(message)
    setToastStatus(type)
    setTimeout(() => setToastMessage(''), duration) // Auto-clear after duration
  }

  return { toastMessage, toastStatus, showToast }
}
