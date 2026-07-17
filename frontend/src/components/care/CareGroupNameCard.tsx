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
    <div className="w-full">
      <motion.div
        className="w-full"
        layout
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.div
          className={`flex min-h-[clamp(2.5rem,5vw,4rem)] w-full cursor-pointer items-center justify-center rounded-xl border-2 p-[clamp(0.35rem,0.8vw,0.75rem)] shadow-lg transition-colors duration-200 ${
            present ? 'bg-green-500 hover:bg-green-400' : 'bg-red-700 hover:bg-red-600'
          }`}
          variants={cardVariants}
          initial="rest"
        >
          <span
            className="w-full break-words text-center text-[clamp(0.8rem,1.6vw,1.5rem)] font-extrabold leading-tight text-white"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            title={name}
          >
            {name}
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default CareGroupNameCard
