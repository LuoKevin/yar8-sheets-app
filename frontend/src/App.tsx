import StudyGroupGrid from './components/StudyGroupGrid';
import { useStudyGroupData } from './hooks/useStudyGroupData';
import GradientBackground from './components/GradientBackground';
import DateSelector from './components/DateSelector';
import { usePostActiveDate } from './hooks/UsePostActiveDate';
import { useGroupDashboard } from './hooks/useGroupDashboard';
import { useStudyDatesData } from './hooks/UseStudyDatesData';
import { useEffect, useState } from 'react';
import { Button } from './components/Button';
import { usePostResetGroups } from './hooks/usePostReset';

const App = () => {
  // const dashboardData = useGroupDashboard()


  const datesData = useStudyDatesData()
  const [activeDate, setActiveDate] = useState(datesData.activeDate)
  const {fetchGroups, groups, groupsLoading, groupsError} = useStudyGroupData(activeDate)
  const {resetGroups, success : resetSuccess, loading: resetLoading, error: resetError} = usePostResetGroups()

  const handleDateSelect = () => {
    fetchGroups()
  }
  
  const handleResetGroups = () => {
    resetGroups().then(() => {
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
        <Button disabled={resetLoading} onClick={() => handleResetGroups()}>Reset Groups</Button>
      </div>
        {/* {dashboardData.loading ? "loading" : ""} */}
        <StudyGroupGrid groups={groups} loading={groupsLoading} error={groupsError} />
      </div>
    </div>
  );
};

export default App;