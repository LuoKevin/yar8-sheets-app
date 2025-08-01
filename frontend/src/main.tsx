import { Routes, Route } from 'react-router-dom'
import StudyGroupsPage from './components/study/StudyGroupsPage'
import AttendancePage from './components/attendance/AttendancePage'
import BackgroundLayout from './components/BackgroundLayout'
import { DateProvider } from './context/DateContext'

const Root = () => (
  <DateProvider>
    <Routes>
      <Route path="/" element={<BackgroundLayout />}>
        <Route index element={<StudyGroupsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
      </Route>
    </Routes>
  </DateProvider>
)

export default Root
