import { motion, Variants } from 'framer-motion'

interface CareGroupNameCardProps {
  name: string
  present: boolean
}

const CareGroupNameCard = ({ name, present }: CareGroupNameCardProps) => {
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
      rotate: Math.random() > 0.5 ? 5 : 3,
      transition: {
        duration: 0.2,
      },
    },
    float: {
      y: [0, -5, 0],
      rotate: [ -1,  1,  -1],
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
      className={`w-28 h-28 sm:w-32 sm:h-32 perspective-1000 origin-center my-1}`}
      layout
      layoutId={name}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
    >
      <motion.div
        className={`w-full rounded-xl shadow-lg flex items-center justify-center p-2 cursor-pointer border-2 transition-colors duration-200 ${
          present
            ? 'h-24 bg-green-500 hover:bg-green-400'
            : 'h-24 bg-red-700 hover:bg-red-600'
        }`}
        variants={cardVariants}
        initial="rest"
        // animate={isAnimating ? 'rest' : 'float'}
        // whileHover={!isAnimating ? 'hover' : {}}
      >
        <span
          className="font-extrabold text-white text-center leading-tight text-xl sm:text-2xl"
          style={{
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
          }}
        >
          {name}
        </span>
      </motion.div>
    </motion.div>
  )
}

export default CareGroupNameCard
