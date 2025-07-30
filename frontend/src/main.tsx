import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StudyGroupsPage from './components/study/StudyGroupsPage'

const Root = () => (
  <Router>
    <Routes>
      <Route path="/" element={<StudyGroupsPage />} />
    </Routes>
  </Router>
)

export default Root
