import { motion, LayoutGroup } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import StudyGroupColumn from './StudyGroupColumn'
import LoadingIndicator from '../LoadingIndicator'

interface StudyGroup {
  leader: string
  members: string[]
}

interface StudyGroupGridProps {
  groups: StudyGroup[]
  loading: boolean
  error: string | null
}

const StudyGroupGrid = ({ groups, loading }: StudyGroupGridProps) => {
  const [displayGroups, setDisplayGroups] = useState(groups)
  const initial = useRef(true)

  // when `groups` changes, just update state
  useEffect(() => {
    if (initial.current) {
      initial.current = false
      setDisplayGroups(groups)
    } else {
      setDisplayGroups(groups)
    }
  }, [groups])

  if (displayGroups.length == 0) return null

  return (
    <div className="relative z-10 min-h-screen w-full px-2 sm:px-4">
      {/* Loading Overlay */}
      <LoadingIndicator isLoading={loading} />

      {/* Main Grid */}
      <div className="w-full pt-4">
        <div className="min-w-full overflow-x-auto">
          <div className="pl-4 sm:pl-0 w-max mx-auto">
            <LayoutGroup>
              <motion.div
                layout
                initial={{ opacity: 0, y: '100vh' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: 'tween',
                  ease: 'easeInOut',
                  stiffness: 150,
                  damping: 15,
                  delay: 0.2,
                }}
                className="grid gap-4 auto-cols-[minmax(150px,1fr)] grid-flow-col"
                style={{ width: 'max-content' }} // allows full natural width
              >
                {displayGroups.map((group) => (
                  <motion.div key={group.leader} layout>
                    <StudyGroupColumn leader={group.leader} members={group.members} />
                  </motion.div>
                ))}
              </motion.div>
            </LayoutGroup>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyGroupGrid
