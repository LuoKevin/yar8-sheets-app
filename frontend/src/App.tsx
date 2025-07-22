import { useEffect, useState } from 'react';
import StudyGroupGrid from './components/StudyGroupGrid';
import { useStudyGroupData } from './components/UseStudyGroupData';
import { StudyGroup } from './api/sheet';

const App = () => {
  const studyGroups = useStudyGroupData();

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <StudyGroupGrid groups={studyGroups} />
      </div>
    </div>
  );
};

export default App;