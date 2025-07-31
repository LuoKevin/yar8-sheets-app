import { useState } from "react"
import { CurrentAttendanceResponse, fetchAttendance } from "../api/sheet"
import { FetchStatus } from "./types"

type Attendee = [string, boolean]

interface FetchAttendanceResult {
    status: FetchStatus
    error: string
    attendees: Attendee[]
    attDateIndex: number
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
          const result: CurrentAttendanceResponse = await fetchAttendance(date)
         
          setStatus(FetchStatus.SUCCESS)
          return {
            status: FetchStatus.SUCCESS,
            error: "",
            attendees: result.attendees.map((a) => [a[0], a[1]]),
            attDateIndex: result.index
            } as FetchAttendanceResult
        } catch(err) {
            setStatus
          return {status: FetchStatus.ERROR, error : err.message || "Unknown error", attendees: [], attDateIndex: -1} as FetchAttendanceResult
        } finally {
        }
        
      
    }

  return { fetchAttendance: getAttendance, status } as UseAttendanceProps
}
