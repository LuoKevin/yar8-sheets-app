import StudyGroupGrid from "./components/StudyGroupGrid"
import { useStudyGroupData } from "./hooks/useStudyGroupData"
import GradientBackground from "./components/GradientBackground"
import DateSelector from "./components/DateSelector"
import { useStudyDatesData } from "./hooks/useStudyDatesData"
import { useEffect, useState } from "react"
import { Button } from "./components/Button"
import { usePostResetGroups } from "./hooks/usePostReset"
import { StudyGroup } from "./api/sheet"
import { useShuffle } from "./hooks/useShuffle"
import { LoadingText } from "./components/LoadingText"

const App = () => {
	// const dashboardData = useGroupDashboard()


	const datesData = useStudyDatesData()
	const [activeDate, setActiveDate] = useState(datesData.activeDate)
	const {fetchGroups, groups, groupsLoading, groupsError, manualSetGroups, scrambleGroups} = useStudyGroupData(activeDate)
	const {resetGroups, resetSuccess, resetLoading, resetError} = usePostResetGroups()
	const { status, isShuffling, startShuffle } = useShuffle(
		()=>{scrambleGroups()},
		(newGroups: StudyGroup[]) => {manualSetGroups(newGroups)}
	)

	const handleDateSelect = () => {
		fetchGroups()
	}
  
	const handleResetGroups = () => {
		resetGroups().then(() => {
			fetchGroups()
		})
	}

	const handleShuffle = () => {
		startShuffle().then(() => {
			fetchGroups()
		})

	}

	useEffect(() => {fetchGroups()}, [])

	return (
		<div className="min-h-screen overflow-hidden">
			<GradientBackground />
			<div className="relative z-10 min-h-screen flex flex-col items-center justify-top p-4">
				<div className="w-full max-w-lg flex items-center space-x-4 mb-6">
					<DateSelector
						dates={datesData.dates}
						initialDate={datesData.activeDate}
						onSelect={handleDateSelect}
					/>
					<Button disabled={resetLoading||isShuffling} onClick={() => handleResetGroups()}>Reset Groups</Button>
					<Button disabled= {isShuffling||resetLoading} onClick={() => handleShuffle()}>Shuffle and Lock</Button>

				</div>
				<div className="w-full max-w-lg flex items-center justify-center space-x-4 mb-6">
					<LoadingText visible={isShuffling} text='Shuffling'/>
					<LoadingText visible={resetLoading} text= 'Resetting'/>
				</div>
				{/* {dashboardData.loading ? "loading" : ""} */}
				<StudyGroupGrid groups={groups} loading={groupsLoading} error={groupsError} />
			</div>
		</div>
	)
}

export default App