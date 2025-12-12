import { motion, LayoutGroup } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import StudyGroupColumn from './StudyGroupColumn.tsx'
import LoadingIndicator from '../LoadingIndicator.tsx'

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
    }
    setDisplayGroups(groups)
  }, [groups])

  // derive grid shape
  const columns = displayGroups.filter((g) => g.members.length > 0).length
  const rows =
    displayGroups.length > 0
      ? Math.max(...displayGroups.map((g) => 1 + g.members.length)) // +1 for leader row
      : 1

  // Tailwind gap-4 = 16px; keep it in a single place
  const GAP = 16

  // expose CSS vars so children can size themselves
  const sizingVars: React.CSSProperties = {
    // width per card = (viewport width - total gaps - a small padding) / columns
    // tweak the extra "2rem" padding if your page has more side padding
    ['--gap' as string]: `${GAP}px`,
    ['--card-w' as string]: `calc((100vw - (${Math.max(columns - 1, 0)} * var(--gap)) - 10rem) / ${Math.max(columns, 1)})`,
    // height per card = (viewport height - total gaps - top padding) / rows
    ['--card-h' as string]: `calc((85vh - (${Math.max(rows - 1, 0)} * var(--gap)) - 4rem) / ${Math.max(rows, 1)})`,
  }

  if (displayGroups.length == 0) return null

  return (
    <div className="relative z-10 min-h-screen w-full px-2 sm:px-4" style={sizingVars}>
      {/* Loading Overlay */}
      <LoadingIndicator isLoading={loading} />

      {/* Main Grid */}
      <div className="w-full pt-4">
        <div className="w-full">
          <div className="mx-auto">
            <LayoutGroup>
              <motion.div
                initial={{ opacity: 0, y: '100vh' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: 'tween',
                  ease: 'easeInOut',
                  stiffness: 150,
                  damping: 15,
                  delay: 0.2,
                }}
                className="grid"
                style={{
                  gridAutoFlow: 'column',
                  columnGap: 'var(--gap)',
                }}
              >
                {displayGroups
                  .filter((group) => group.members.length > 0)
                  .map((group) => (
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
