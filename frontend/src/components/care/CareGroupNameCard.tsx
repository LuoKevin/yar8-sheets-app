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
      rotate: [-1, 1, -1],
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
    <div className="w-full h-full">
      <motion.div
        className="w-full h-full"
        layout
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.div
          className={`w-full h-full rounded-xl shadow-lg flex items-center justify-center p-2 cursor-pointer border-2 transition-colors duration-200 ${
            present ? 'bg-green-500 hover:bg-green-400' : 'bg-red-700 hover:bg-red-600'
          }`}
          variants={cardVariants}
          initial="rest"
        >
          <span
            className="font-extrabold text-white text-center leading-tight text-xl sm:text-2xl"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
          >
            {name}
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default CareGroupNameCard
