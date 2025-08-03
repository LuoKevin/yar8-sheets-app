import { useState } from "react"
import { apiFetchCareGroups, CareGroup, CareGroupsResponse } from "../api/sheet"
import { FetchStatus } from "./types"


interface CareGroupData {
    fetchCareGroups: () => Promise<void>
    careGroups: CareGroup[]
    status: FetchStatus
    loading: boolean
    error: string | null
}

export function useCareGroups(): CareGroupData {
    const [careGroups, setCareGroups] = useState<CareGroup[]>([])
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(FetchStatus.IDLE)
    const [error, setError] = useState<string | null>(null)

    const fetchCareGroups: () => Promise<void> = () => {
        setStatus(FetchStatus.LOADING)
        setLoading(true)
        return apiFetchCareGroups()
        .then((groupsResponse: CareGroupsResponse) => {
            setCareGroups(groupsResponse.groups)
            setStatus(FetchStatus.SUCCESS)
        }).catch((err) => {
            setError(`Error in fetching care groups. Reason:${err.message || "Unknown"}`)
            setStatus(FetchStatus.ERROR)
        }).finally(() => {
            setLoading(false)
        })
    }
    return {fetchCareGroups, careGroups, status, loading, error}
}