// src/hooks/useLongTask.ts
import { useEffect, useState, useRef, useCallback } from 'react'
import { shuffleAndLock, StudyGroup } from '../api/sheet'
import { FetchStatus } from './types'

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

export function useShuffle(
  onShuffle: () => void,
  onFinish: (newGroups: StudyGroup[]) => void,
): ShuffleData {
  const [progress, setProgress] = useState(0)
  const [isShuffling, setIsShuffling] = useState(false)
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.IDLE)
  const [error, setError] = useState('')

  const startShuffle = async (): Promise<ShuffleResult> => {
    const intervalId = window.setInterval(onShuffle, 500)
    setIsShuffling(true)
    setStatus(FetchStatus.LOADING)
    setError('')
      try {
        await shuffleAndLock()
        return {responseStatus: FetchStatus.SUCCESS, error: ""} as ShuffleResult
      } catch(err) {
        return {responseStatus: FetchStatus.ERROR, error : err.message || "Unknown error"} as ShuffleResult
      } finally {
        setIsShuffling(false)
        clearInterval(intervalId)
      }
      
    
  }

  return { status, shufflingError: error, isShuffling, startShuffle }
}
