import { useState } from 'react'
import { CurrentAttendanceResponse, apiFetchAttendance } from '../api/sheet.ts'
import { FetchStatus } from './types.ts'

type Attendee = [string, boolean]

interface FetchAttendanceResult {
  status: FetchStatus
  error: string
  attendees: Attendee[]
  attDateIndex: number
  latecomerTimes: string[]
}

interface UseAttendanceProps {
  fetchAttendance: (date: string) => Promise<FetchAttendanceResult>
  status: FetchStatus
}

export function useAttendance(): UseAttendanceProps {
  const [status, setStatus] = useState(FetchStatus.IDLE)
  const getAttendance = async (date: string): Promise<FetchAttendanceResult> => {
    try {
      setStatus(FetchStatus.LOADING)
      const result: CurrentAttendanceResponse = await apiFetchAttendance(date)

      setStatus(FetchStatus.SUCCESS)
      return {
        status: FetchStatus.SUCCESS,
        error: '',
        attendees: result.attendees.map((a) => [a[0], a[1]]),
        attDateIndex: result.index,
        latecomerTimes: result.latecomers,
      } as FetchAttendanceResult
    } catch (err) {
      setStatus(FetchStatus.ERROR)
      return {
        status: FetchStatus.ERROR,
        error: err.message || 'Unknown error',
        attendees: [],
        attDateIndex: -1,
        latecomerTimes: [],
      } as FetchAttendanceResult
    }
  }

  return { fetchAttendance: getAttendance, status } as UseAttendanceProps
}
