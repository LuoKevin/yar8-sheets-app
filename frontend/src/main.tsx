import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StudyGroupsPage from './components/study/StudyGroupsPage'
import AttendancePage from './components/attendance/AttendancePage'
import BackgroundLayout from './components/BackgroundLayout'

const Root = () => (
    <Routes>
      <Route path="/" element={<BackgroundLayout />}>
        <Route index element={<StudyGroupsPage />} />
        <Route path="/attendance" element={<AttendancePage />}/>
      </Route>
    </Routes>
)

export default Root
