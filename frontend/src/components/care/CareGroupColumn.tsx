import { motion } from 'framer-motion'
import { CareGroup } from '../../api/sheet.ts'
import CareGroupNameCard from './CareGroupNameCard.tsx'

interface CareGroupColumnProps {
  group: CareGroup
}

const CareGroupColumn = ({ group }: CareGroupColumnProps) => {
  const presentMembers = group.members.filter((_, index) => group.attendance[index])

  return (
    <motion.ul
      layout
      initial={false} // <- important: don’t re-run entry animation on data updates
      transition={{ layout: { type: 'spring', stiffness: 500, damping: 36 } }}
      className="flex h-full w-full min-w-0 flex-col items-stretch gap-[clamp(0.25rem,0.75vw,0.5rem)] rounded-xl bg-white/30 p-[clamp(0.5rem,1.25vw,1rem)] backdrop-blur-md"
    >
      {presentMembers.map((member) => (
        <CareGroupNameCard key={member} name={member} present />
      ))}
      {presentMembers.length === 1 && <CareGroupNameCard name="John 16:32" present />}
    </motion.ul>
  )
}

export default CareGroupColumn
