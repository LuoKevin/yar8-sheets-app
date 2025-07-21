import { api } from "./client"
import type { paths, components } from "./openapi.types"

export type StudyGroupResponse = components["schemas"]["StudyGroupResponse"]
export type StudyGroup = components["schemas"]["StudyGroup"]
export type DateModel = components["schemas"]["DateModel"]

export function fetchStudyGroupData(): Promise<StudyGroupResponse> {
    return api
    .get<StudyGroupResponse>("/sheets/study-group-data")
    .then((r: StudyGroupResponse) => r.data);
}

export function postActiveStudyDate(): 