import { motion } from 'framer-motion'
import StudyGroupCard from './StudyGroupCard'

interface StudyGroupColumnProps {
  leader: string
  members: string[]
  isAnimating?: boolean
}

const StudyGroupColumn = ({ leader, members, isAnimating }: StudyGroupColumnProps) => {
  return (
    <motion.div
      className="flex flex-col items-center mx-2 space-y-2 pt-6 px-1 bg-white/20 rounded-lg shadow-lg rounded-2xl"
      initial={{ opacity: 0, y: '100vh' }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'tween',
        ease: 'easeInOut',
        stiffness: 150,
        damping: 15,
        delay: 0.2,
      }}
    >
      <StudyGroupCard name={leader} isLeader isAnimating={isAnimating} />

      <div className="flex flex-col items-center">
        {members.map((member) => (
          <StudyGroupCard key={member} name={member} isAnimating={isAnimating} />
        ))}
      </div>
    </motion.div>
  )
}

export default StudyGroupColumn
