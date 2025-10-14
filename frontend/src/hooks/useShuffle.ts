// src/hooks/useLongTask.ts
import { useState } from 'react'
import { apiShuffleAndLock } from '../api/sheet.ts'
import { FetchStatus } from './types.ts'

interface ShuffleResult {
  responseStatus: FetchStatus
  error: string
}

interface ShuffleData {
  status: FetchStatus
  isShuffling: boolean
  shufflingError: string
  startShuffle: () => Promise<ShuffleResult>
}

export function useShuffle(onShuffle: () => void): ShuffleData {
  const [isShuffling, setIsShuffling] = useState(false)
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.IDLE)
  const [error, setError] = useState('')

  const startShuffle = async (): Promise<ShuffleResult> => {
    const intervalId = window.setInterval(onShuffle, 1000)
    setIsShuffling(true)
    setStatus(FetchStatus.LOADING)
    setError('')
    try {
      await apiShuffleAndLock()
      return { responseStatus: FetchStatus.SUCCESS, error: '' } as ShuffleResult
    } catch (err) {
      return {
        responseStatus: FetchStatus.ERROR,
        error: err.message || 'Unknown error',
      } as ShuffleResult
    } finally {
      setIsShuffling(false)
      clearInterval(intervalId)
    }
  }

  return { status, shufflingError: error, isShuffling, startShuffle }
}
