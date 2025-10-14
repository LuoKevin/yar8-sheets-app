import api from './client.ts'
import type { components } from './openapi.types.ts'

type schemas = components['schemas']

export type StudyGroupResponse = schemas['StudyGroupResponse']
export type StudyGroup = schemas['StudyGroup']
export type DateModel = schemas['DateModel']
export type StudyDatesResponse = schemas['StudyDatesResponse']
export type CurrentAttendanceResponse = schemas['CurrentAttendanceResponse']
export type PostAttendanceRequest = schemas['PostAttendanceRequest']
export type CareGroupsResponse = schemas['CareGroupsResponse']
export type PostNewAttendeeRequest = schemas['PostNewFollowerRequest']
export type CareGroup = schemas['CareGroup']

export function apiFetchStudyGroupData(): Promise<[StudyGroup[], boolean]> {
  return api.get<StudyGroupResponse>('/sheets/study-group-data').then((value) => {
    const groups = value.data.groups as StudyGroup[]
    const locked = value.data.locked
    return [groups, locked]
  })
}

export function apiPostActiveStudyDate(activeDate: string): Promise<DateModel> {
  return api.post('/sheets/active-study-date', { date: activeDate })
}

export function apiFetchStudyDates(): Promise<StudyDatesResponse> {
  return api.get<StudyDatesResponse>('/sheets/study-dates').then((value) => value.data)
}

export function apiPostResetGroups(): Promise<void> {
  return api.post('/sheets/reset-groups')
}

export function apiShuffleAndLock(): Promise<void> {
  return api.post('/sheets/shuffle-lock')
}

export function apiFetchAttendance(date: string): Promise<CurrentAttendanceResponse> {
  return api.get('/sheets/attendance', { params: { date } }).then((res) => res.data)
}

export function apiPostAttendance(request: PostAttendanceRequest): Promise<void> {
  return api.post('/sheets/take-attendance', request)
}

export function apiFetchCareGroups(): Promise<CareGroupsResponse> {
  return api.get('/sheets/care-groups').then((value) => value.data)
}

export function apiPostNewAttendee(name: string): Promise<void> {
  return api.post('/sheets/new-follower', { name: name } as PostNewAttendeeRequest)
}
