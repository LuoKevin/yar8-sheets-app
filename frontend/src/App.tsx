import StudyGroupGrid from './components/StudyGroupGrid';
import { useStudyGroupData } from './hooks/useStudyGroupData';
import GradientBackground from './components/GradientBackground';
import DateSelector from './components/DateSelector';
import { usePostActiveDate } from './hooks/UsePostActiveDate';
import { useGroupDashboard } from './hooks/useGroupDashboard';
import { useStudyDatesData } from './hooks/UseStudyDatesData';
import { useEffect, useState } from 'react';

const App = () => {
  // const dashboardData = useGroupDashboard()


  const datesData = useStudyDatesData()
  const [activeDate, setActiveDate] = useState(datesData.activeDate)
  const {fetchGroups, groups, groupsLoading, groupsError} = useStudyGroupData(activeDate)

  const handleDateSelect = () => {
    fetchGroups()
  }

  useEffect(() => {fetchGroups()}, [])

  return (
    <div className="min-h-screen overflow-hidden">
      <GradientBackground />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-top p-4">
        <DateSelector
          dates={datesData.dates}
          initialDate={datesData.activeDate}
          onSelect={handleDateSelect}
        />
        {/* {dashboardData.loading ? "loading" : ""} */}
        <StudyGroupGrid groups={groups} />
      </div>
    </div>
  );
};

export default App;