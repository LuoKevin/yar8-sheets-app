import { motion, Variants } from 'framer-motion'

interface StudyGroupCardProps {
  name: string
  isLeader?: boolean
  isAnimating?: boolean
}

const StudyGroupCard = ({ name, isLeader = false, isAnimating = false }: StudyGroupCardProps) => {
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
      y: isLeader ? -15 : -5,
      scale: isLeader ? 1.15 : 1.05,
      rotate: Math.random() > 0.5 ? (isLeader ? 5 : 3) : isLeader ? -5 : -3,
      transition: {
        duration: 0.2,
      },
    },
    float: {
      y: [0, isLeader ? -10 : -5, 0],
      rotate: [isLeader ? -3 : -1, isLeader ? 3 : 1, isLeader ? -3 : -1],
      transition: {
        y: {
          duration: 2 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        rotate: {
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    },
  }

  return (
    <motion.div
      className={`w-32 h-28 sm:w-40 sm:h-36 perspective-1000 origin-center ${isLeader ? 'mb-4' : 'my-1'}`}
      layout
      layoutId={name}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
    >
      <motion.div
        className={`h-28 w-full rounded-xl shadow-lg flex items-center justify-center p-2 cursor-pointer border-2 transition-colors duration-200 ${
          isLeader
            ? 'sm:h-32 bg-yellow-500 hover:bg-yellow-400'
            : 'sm:h-32 bg-indigo-700 hover:bg-indigo-600'
        }`}
        variants={cardVariants}
        initial="rest"
        animate={isAnimating ? 'rest' : 'float'}
        whileHover={!isAnimating ? 'hover' : {}}
      >
        <span className="text-shadow-lg/50 font-extrabold text-white text-center leading-tight text-2xl sm:text-3xl">
          {name}
        </span>
      </motion.div>
    </motion.div>
  )
}

export default StudyGroupCard
