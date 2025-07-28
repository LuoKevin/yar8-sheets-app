import { useEffect, useState } from "react";
import { fetchBalancedGroups, Leader, StudyGroup } from "../api/sheet";


interface StudySessionData {
    fetchStudySession: () => Promise<void>
    groups: StudyGroup[]
    date: string
    leaders: Leader[]
    loading: boolean
    error: string | null
}

export function useStudySession(): StudySessionData {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [groups, setGroups] = useState<StudyGroup[]>([])
    const [date, setDate] = useState("")
    const [leaders, setLeaders] = useState<Leader[]>([])

    const fetchStudySession = async () => {
        setLoading(true)
        setError(null)

        fetchBalancedGroups()
        .then((res) => {
            setGroups(res.study_groups)
            setLeaders(res.leaders)
            setDate(res.date)
        })
        .catch(err => setError(err.message || "Unknown error"))
        .finally(() => setLoading(false))
    }

    return {fetchStudySession, groups, date, leaders, loading, error}
}