import { Routes, Route, useLocation } from 'react-router-dom'
import StudyGroupsPage from './components/study/StudyGroupsPage'
import AttendancePage from './components/attendance/AttendancePage'
import BackgroundLayout from './components/BackgroundLayout'
import { DateProvider } from './context/DateContext'
import { AnimatePresence, motion, Transition } from 'framer-motion'
import PageTransitionWrapper from './components/PageTransitionWrapper'
import { PageProvider } from './context/PageContext'
import GradientBackground from './components/GradientBackground'
import CareGroupsPage from './components/care/CareGroupsPage'

const slideInFromLeftVars = {
  initial: { x: '-100%', opacity: 0 }, // ⬅️ Start off-screen to the left
  animate: { x: 0, opacity: 1 }, // ⬆️ Animate into view
  exit: { x: '-100vw', opacity: 0 }, // ⬅️ Slide back out to the left
  transition: { type: 'tween', duration: 0.4 },
}

const slideInFromRightVars = {
  initial: { x: '100%', opacity: 0 }, // 👉 Start off-screen to the right
  animate: { x: 0, opacity: 1 }, // ⬅️ Animate into center
  exit: { x: '100vw', opacity: 0 }, // 👉 Slide out to the right
  transition: { type: 'tween', duration: 0.4 },
}

const Root = () => {
  const location = useLocation()
  return (
    <DateProvider>
      <PageProvider>
        <GradientBackground /> {/* ✅ This stays mounted across routes */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<BackgroundLayout />}>
              <Route
                index
                element={
                  <PageTransitionWrapper variants={slideInFromRightVars}>
                    <StudyGroupsPage />
                  </PageTransitionWrapper>
                }
              />

              <Route
                path="/attendance"
                element={
                  <PageTransitionWrapper variants={slideInFromLeftVars}>
                    <AttendancePage />
                  </PageTransitionWrapper>
                }
              />
              <Route
                path="/care"
                element={
                  <PageTransitionWrapper variants={slideInFromRightVars}>
                    <CareGroupsPage />
                  </PageTransitionWrapper>
                }
              />
            </Route>
          </Routes>
        </AnimatePresence>
      </PageProvider>
    </DateProvider>
  )
}

export default Root
