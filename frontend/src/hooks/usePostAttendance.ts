import { useState } from 'react'
import { postAttendance } from '../api/sheet'
import { FetchStatus } from './types'

interface PostAttendanceResponse {
  status: FetchStatus
  error: string | undefined
}

interface UsePostAttendance {
  submitAttendance: (index: number, attendanceState: boolean[], latecomers: string[]) => Promise<PostAttendanceResponse>
}

export function usePostAttendance(): UsePostAttendance {
  const submitAttendance = async (index: number, attendanceState: boolean[], latecomers: string[]) => {
    try {
      await postAttendance({ index, attendees: attendanceState, latecomers })
      return { status: FetchStatus.SUCCESS } as PostAttendanceResponse
    } catch (err) {
      return {
        status: FetchStatus.ERROR,
        error: `Error in posting attendance. Reason:${err.message || 'Unknown'}`,
      } as PostAttendanceResponse
    }
  }
  return { submitAttendance }
}
