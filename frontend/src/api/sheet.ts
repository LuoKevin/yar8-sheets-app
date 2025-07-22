
import api from "./client";
import type { paths, components } from "./openapi.types"

export type StudyGroupResponse = components["schemas"]["StudyGroupResponse"]
export type StudyGroup = components["schemas"]["StudyGroup"]
export type DateModel = components["schemas"]["DateModel"]

export function fetchStudyGroupData(): Promise<StudyGroup[]> {
    return api
    .get<StudyGroupResponse>("/sheets/study-group-data")
    .then(value => value.data.groups as StudyGroup[])
}

export function postActiveStudyDate(): Promise<DateModel> {
    return api
    .get<DateModel>("/sheets/active-study-date")
    .then((value) => value.data as DateModel)
}