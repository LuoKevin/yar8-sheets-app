import { useRef, useState } from 'react'
import { ToastType } from './types'

export const useToast = () => {
  const [toastMessage, setToastMessage] = useState<string>('') // Just stores the message string
  const [toastStatus, setToastStatus] = useState<string>('info')

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setToastMessage(message)
    setToastStatus(type)
    setTimeout(() => {
      setToastMessage('')
      timeoutRef.current = null
    }, duration) // Auto-clear after duration
  }

  return { toastMessage, toastStatus, showToast }
}
