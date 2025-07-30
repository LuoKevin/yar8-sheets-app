import { motion, Variants } from 'framer-motion'
import { Button } from '../Button'

interface AttendanceCardProps {
  name: string
  present: boolean
  onToggle: () => void
}

const AttendanceCard = ({ name, present, onToggle }: AttendanceCardProps) => {
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
      layout
      variants={cardVariants}
      initial="rest"
      animate="float"
      whileHover="hover"
      className="w-28 h-28 sm:w-32 sm:h-32 perspective-1000 origin-center"
    >
      <motion.div
        className={`w-full h-full rounded-xl shadow-lg flex flex-col items-center justify-center p-2 border-2 transition-colors duration-200 cursor-pointer ${
          present
            ? 'bg-green-600 border-green-300 hover:bg-green-500'
            : 'bg-red-600 border-red-300 hover:bg-red-500'
        }`}
        onClick={onToggle}
      >
        <span
          className="font-extrabold text-white text-center leading-tight text-xl sm:text-2xl"
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
        >
          {name}
        </span>
        <span className="text-white text-sm mt-1">
          {present ? '✅ Present' : '❌ Absent'}
        </span>
      </motion.div>
    </motion.div>
  )
}

export default AttendanceCard
