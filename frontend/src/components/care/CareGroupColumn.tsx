import { motion } from 'framer-motion'
import { CareGroup } from '../../api/sheet.ts'
import CareGroupNameCard from './CareGroupNameCard.tsx'

interface CareGroupColumnProps {
  group: CareGroup
}

const CareGroupColumn = ({ group }: CareGroupColumnProps) => {
  return (
    <motion.ul
      layout
      initial={false} // <- important: don’t re-run entry animation on data updates
      transition={{ layout: { type: 'spring', stiffness: 500, damping: 36 } }}
      className="flex flex-col items-center gap-2 backdrop-blur-md bg-white/30 rounded-lg mx-1 space-y-2 py-6 px-2"
    >
      {group.members.map((member, index) => (
        <CareGroupNameCard key={member} name={member} present={group.attendance[index]} />
      ))}
    </motion.ul>
  )
}

export default CareGroupColumn
