import { motion } from 'framer-motion'
import { CareGroup } from '../../api/sheet'
import CareGroupNameCard from './CareGroupNameCard'

interface CareGroupClusterProps {
  group: CareGroup
}

const CareGroupCluster = ({ group }: CareGroupClusterProps) => {
  const MAX_CARDS = 9
  const filledCards = group.members.map((name, i) => (
    <CareGroupNameCard key={name} name={name} present={group.attendance[i]} />
  ))

  const emptyCards = Array.from({ length: MAX_CARDS - group.members.length }).map((_, idx) => (
    <div key={`placeholder-${idx}`} className="invisible">
      <CareGroupNameCard name="placeholder" present={false} />
    </div>
  ))

  return (

    <motion.div 
    className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-white/10 backdrop-blur-sm shadow-md min-h-[300px]"
      initial={{ opacity: 0, x: "100vw" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: 'tween',
        ease: "easeInOut",
        stiffness: 150,
        damping: 15,
        delay: 0.2,
      }}
    >
      {filledCards}
      {emptyCards}
    </motion.div>
  )
}

export default CareGroupCluster
