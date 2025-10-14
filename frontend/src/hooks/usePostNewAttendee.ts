import { apiPostNewAttendee } from '../api/sheet.ts'
import { FetchStatus } from './types.ts'

interface AddNewAttendeeResponse {
  status: FetchStatus
  error: string | undefined
}

interface UsePostNewAttendee {
  addNewAttendee: (name: string) => Promise<AddNewAttendeeResponse>
}

export function usePostNewAttendee(): UsePostNewAttendee {
  const addNewAttendee = async (name: string) => {
    try {
      await apiPostNewAttendee(name)
      return { status: FetchStatus.SUCCESS } as AddNewAttendeeResponse
    } catch (err) {
      return {
        status: FetchStatus.ERROR,
        error: `Error in posting attendance. Reason:${err.message || 'Unknown'}`,
      } as AddNewAttendeeResponse
    }
  }
  return { addNewAttendee }
}
