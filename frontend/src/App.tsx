import StudyGroupGrid from './components/StudyGroupGrid';
import { useStudyGroupData } from './components/UseStudyGroupData';
import LiquidSwirlBackground from './components/LiquidSwirlBackground';
import GradientBackground from './components/GradientBackground';

const App = () => {
  const studyGroups = useStudyGroupData();

  return (
    <div className="min-h-screen overflow-hidden">
      <GradientBackground />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <StudyGroupGrid groups={studyGroups} />
      </div>
    </div>
  );
};

export default App;