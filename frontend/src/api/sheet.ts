import api from './client'
import type { paths, components } from './openapi.types'

export type StudyGroupResponse = components['schemas']['StudyGroupResponse']
export type StudyGroup = components['schemas']['StudyGroup']
export type DateModel = components['schemas']['DateModel']
export type StudyDatesResponse = components['schemas']['StudyDatesResponse']

export function fetchStudyGroupData(): Promise<StudyGroup[]> {
  return api
    .get<StudyGroupResponse>('/sheets/study-group-data')
    .then((value) => value.data.groups as StudyGroup[])
}

export function postActiveStudyDate(activeDate: string): Promise<DateModel> {
  return api.post('/sheets/active-study-date', { date: activeDate })
  // .then((value) => value.data as DateModel)
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
