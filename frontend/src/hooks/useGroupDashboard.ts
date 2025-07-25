import { useState, useEffect } from "react"
import { fetchStudyDates, fetchStudyGroupData, StudyGroup } from "../api/sheet"

interface GroupDashboardData {
    groups: StudyGroup[]
    studyDates: string[]
    activeDate: string
    loading: boolean
    error: string | null
}

export function useGroupDashboard(): GroupDashboardData {
	const [groups, setActiveGroups] = useState<StudyGroup[]>([])
	const [studyDates, setStudyDates] = useState<string[]>([])
	const [activeDate, setActiveDate] = useState<string>("")

	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let mounted = true
       
		setLoading(true)
		setError(null)

		Promise.all([fetchStudyGroupData(), fetchStudyDates()])
			.then(([groups, dateResponse]) => {
				if(!mounted) return
				setActiveGroups(groups)
				setStudyDates(dateResponse.dates)
				setActiveDate(dateResponse.activeDate)
			})
			.catch(err => {
				if(!mounted) return
				setError(err.message || "Unknown Error")
			})
			.finally(() => {
				if(!mounted) return
				setLoading(false)
			})
        

		return () => {
			mounted = false
		}

	}, [])

	return {groups, studyDates, activeDate, loading, error} as GroupDashboardData
}
