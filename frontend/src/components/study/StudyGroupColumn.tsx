import { motion } from 'framer-motion'
import StudyGroupCard from './StudyGroupCard.tsx'

interface StudyGroupColumnProps {
  leader: string
  members: string[]
  isAnimating?: boolean
}

const StudyGroupColumn = ({ leader, members, isAnimating }: StudyGroupColumnProps) => {
  return (
    <motion.div
      layout
      initial={false} // <- important: don’t re-run entry animation on data updates
      className="flex flex-col items-center mx-2 space-y-2 pt-6 px-1"
      transition={{ layout: { type: 'spring', stiffness: 500, damping: 36 } }}
    >
      <StudyGroupCard name={leader} isLeader isAnimating={isAnimating} />

      <motion.ul layout className="flex flex-col items-center gap-2">
        {members.map((member) => (
          <li key={member}>
            <StudyGroupCard name={member} isAnimating={isAnimating} />
          </li>
        ))}
      </motion.ul>
    </motion.div>
  )
}

export default StudyGroupColumn
