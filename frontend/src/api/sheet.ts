import api from './client'
import type { paths, components } from './openapi.types'

export type StudyGroupResponse = components['schemas']['StudyGroupResponse']
export type StudyGroup = components['schemas']['StudyGroup']
export type DateModel = components['schemas']['DateModel']
export type StudyDatesResponse = components['schemas']['StudyDatesResponse']
export type CurrentAttendanceResponse = components['schemas']['CurrentAttendanceResponse']

export function fetchStudyGroupData(): Promise<[StudyGroup[], boolean]> {
  return api
    .get<StudyGroupResponse>('/sheets/study-group-data')
    .then((value) => {
      const groups = value.data.groups as StudyGroup[]
      const locked = value.data.locked
      return [groups, locked]
    })
}

export function postActiveStudyDate(activeDate: string): Promise<DateModel> {
  return api.post('/sheets/active-study-date', { date: activeDate })
}

export function fetchStudyDates(): Promise<StudyDatesResponse> {
  return api.get<StudyDatesResponse>('/sheets/study-dates').then((value) => value.data)
}

export function postResetGroups(): Promise<void> {
  return api.post('/sheets/reset-groups')
}

export function shuffleAndLock(): Promise<void> {
  return api.post('/sheets/shuffle-lock')
}

export function fetchAttendance(date: string): Promise<CurrentAttendanceResponse> {
  return api.get('/sheets/attendance', { params:{date} })
  .then((res) => res.data)
}