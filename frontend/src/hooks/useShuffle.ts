// src/hooks/useLongTask.ts
import { useEffect, useState, useRef, useCallback } from 'react'
import { shuffleAndLock, StudyGroup } from '../api/sheet'
import { FetchStatus } from './types'

interface ShuffleData {
  status: FetchStatus
  isShuffling: boolean
  shufflingError: string
  startShuffle: () => Promise<void>
}

export function useShuffle(
  onShuffle: () => void,
  onFinish: (newGroups: StudyGroup[]) => void,
): ShuffleData {
  const [progress, setProgress] = useState(0)
  const [isShuffling, setIsShuffling] = useState(false)
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.IDLE)
  const [error, setError] = useState('')

  const startShuffle = async (): Promise<void> => {
    const intervalId = window.setInterval(onShuffle, 500)
    setIsShuffling(true)
    setStatus(FetchStatus.LOADING)
    setError('')

    await shuffleAndLock()
      .then(() => {
        setStatus(FetchStatus.SUCCESS)
      })
      .catch((err) => {
        setStatus(FetchStatus.ERROR)
        setError(err.message || 'Unknown error')
      })
      .finally(() => {
        setIsShuffling(false)
        clearInterval(intervalId)
      })
  }

  return { status, shufflingError: error, isShuffling, startShuffle }
}
