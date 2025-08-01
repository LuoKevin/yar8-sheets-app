import { motion, Variants } from 'framer-motion'

interface AttendanceCardProps {
  name: string
  present: boolean
  lateTime: string
  latecomerMode: boolean
  onToggle: () => void
}

const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window


const AttendanceCard = ({ name, present, lateTime, latecomerMode, onToggle }: AttendanceCardProps) => {
  const cardVariants: Variants = {
    rest: {
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 15,
      },
    },
    hover: {
      y: -5,
      scale: 1.05,
      rotate: Math.random() > 0.5 ? 2 : -2,
      transition: { duration: 0.2 },
    },
    float: {
      y: [0, -5, 0],
      rotate: [-1, 1, -1],
      transition: {
        y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
      },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover={isTouchDevice ? undefined : "hover"}
      whileTap={{ scale: 0.97 }}
      className="w-full max-w-xs sm:max-w-sm h-24 sm:h-28 md:h-32 perspective-1000 origin-center"
    >
      <motion.div
       className={`w-full h-full rounded-lg shadow-lg flex items-center justify-center border-2 transition-colors duration-200 cursor-pointer ${
  lateTime
    ? 'bg-yellow-600 border-yellow-300 hover:bg-yellow-500'
    : present
    ? 'bg-green-600 border-green-300 hover:bg-green-500'
    : 'bg-red-600 border-red-300 hover:bg-red-500'
}`}
        onClick={onToggle}
      >
        <span
  className="font-extrabold text-white text-2xl sm:text-3xl md:text-4xl text-center"
  style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
>
  {name}
</span>
{lateTime && (
  <span className="font-extrabold text-white text-xl mt-1 block pr-1">
    {lateTime.split(' ')[1]}
  </span>
)}
      </motion.div>
    </motion.div>
  )
}

export default AttendanceCard
