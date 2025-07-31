import { useState } from "react";
import { postAttendance } from "../api/sheet";
import { FetchStatus } from "./types";


interface PostAttendanceResponse {
    status: FetchStatus
    error: string | undefined
}

interface UsePostAttendance {
    submitAttendance: (index: number, attendanceState: boolean[]) => Promise<PostAttendanceResponse>
}

export function usePostAttendance(): UsePostAttendance {
    const [status, setStatus] = useState(FetchStatus.IDLE)
    const [error, setError] = useState<string | undefined>(undefined)
    const submitAttendance = async(index: number, attendanceState: boolean[]) => {
        setStatus(FetchStatus.LOADING)
        try {
            await postAttendance({index, attendees: attendanceState})
            setStatus(FetchStatus.SUCCESS)
        } catch (err) {
            setStatus(FetchStatus.ERROR)
            setError(`Error in posting attendance. Reason:${err.message || "Unknown"}`)
        } finally {
            return {status, error}
        }
    }

    return {submitAttendance}
}
