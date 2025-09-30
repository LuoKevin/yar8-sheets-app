import { motion, Variants } from 'framer-motion'
import { useMemo } from 'react'

interface StudyGroupCardProps {
  name: string
  isLeader?: boolean
  isAnimating?: boolean
}

function seeded(name: string) {
  let h = 2166136261
  for (let i = 0; i < name.length; i++) h = (h ^ name.charCodeAt(i)) * 16777619
  const rnd = (n: number) => ((Math.abs(Math.sin(n * 1.27 + h)) % 1) + 0.0001) % 1
  return { rnd }
}

const StudyGroupCard = ({ name, isLeader = false, isAnimating = false }: StudyGroupCardProps) => {
  const layoutId = useMemo(() => name.replace(/\s+/g, '-').toLowerCase(), [name])

  // stable per-card “random” so animations don’t change during layout
  const { hoverRotate, floatAmpY, floatRotate, floatDurY, floatDurRot } = useMemo(() => {
    const { rnd } = seeded(name)
    return {
      hoverRotate: (rnd(1) > 0.5 ? 1 : -1) * (isLeader ? 5 : 3),
      floatAmpY: (isLeader ? 10 : 5) * (0.85 + rnd(2) * 0.3),
      floatRotate: (isLeader ? 3 : 1) * (0.85 + rnd(3) * 0.3),
      floatDurY: 1.8 + rnd(4) * 1.6,
      floatDurRot: 2.2 + rnd(5) * 1.8,
    }
  }, [name, isLeader])

  const cardVariants: Variants = {
    rest: { scale: 1 },
    hover: {
      y: isLeader ? -15 : -5,
      scale: isLeader ? 1.12 : 1.05,
      rotate: hoverRotate,
      transition: { duration: 0.18, ease: 'easeOut' },
    },
    float: {
      y: [0, -floatAmpY, 0],
      rotate: [-floatRotate, floatRotate, -floatRotate],
      transition: {
        y: { duration: floatDurY, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: floatDurRot, repeat: Infinity, ease: 'easeInOut' },
      },
    },
  }

  return (
    <motion.div
      layout
      layoutId={layoutId}
      transition={{ layout: { type: 'spring', stiffness: 500, damping: 36 } }}
      className={`w-32 h-28 sm:w-30 sm:h-28 origin-center ${isLeader ? 'mb-4' : ''} transform-gpu will-change-transform`}
    >
      <motion.div
        className={`h-28 w-full rounded-xl shadow-lg flex items-center justify-center p-2 cursor-pointer border-2 transition-colors duration-200 ${
          isLeader
            ? 'sm:h-24 bg-yellow-500 hover:bg-yellow-400'
            : 'sm:h-24 bg-indigo-700 hover:bg-indigo-600'
        }`}
        variants={cardVariants}
        initial="rest"
        animate={isAnimating ? 'rest' : 'float'}
        whileHover={isAnimating ? undefined : 'hover'}
      >
        <span className="text-shadow-lg/50 font-extrabold text-white text-center leading-tight text-xl sm:text-2xl">
          {name}
        </span>
      </motion.div>
    </motion.div>
  )
}

export default StudyGroupCard
