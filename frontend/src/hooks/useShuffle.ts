// src/hooks/useLongTask.ts
import { useEffect, useState, useRef, useCallback } from "react"
import { shuffleAndLock, StudyGroup } from "../api/sheet"
import { FetchStatus } from "./types"

interface ShuffleData {
    status: FetchStatus
    isShuffling: boolean
	startShuffle: () => Promise<void>
}

export function useShuffle(onShuffle: () => void, onFinish: (newGroups: StudyGroup[]) => void): ShuffleData {
	const [progress, setProgress] = useState(0)
	const [isShuffling, setIsShuffling] = useState(false)
	const [status, setStatus]     = useState<FetchStatus>(FetchStatus.IDLE)

	const startShuffle = async (): Promise<void> => {
		const intervalId = window.setInterval(onShuffle, 1000)
		setIsShuffling(true)
		setStatus(FetchStatus.LOADING)
		try {
			// Perform the POST
			const data = await shuffleAndLock()
			setStatus(FetchStatus.SUCCESS)
			return data
		} catch { 
			setStatus(FetchStatus.ERROR)
		}finally {
			// Always clear the interval, even if POST throws
			setIsShuffling(false)
			clearInterval(intervalId)
		}
	}

	return { status, isShuffling, startShuffle }
}
