import { motion } from "framer-motion";

interface StudyGroupCardProps {
  name: string;
  isLeader?: boolean;
  isAnimating?: boolean;
}

const StudyGroupCard = ({ name, isLeader = false, isAnimating = false }: StudyGroupCardProps) => {
  const cardVariants = {
    rest: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
      },
    },
    hover: {
      y: isLeader ? -15 : -5,
      scale: isLeader ? 1.15 : 1.05,
      rotate: Math.random() > 0.5 ? (isLeader ? 5 : 3) : (isLeader ? -5 : -3),
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
          ease: "easeInOut",
        },
        rotate: {
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
  };

  return (
    <motion.div
      className={`h-32 w-32 perspective-1000 origin-center ${isLeader ? "mb-4" : "my-1"}`}
      layout
      layoutId = {name}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
    >
      <motion.div
        className={`w-full rounded-xl shadow-lg flex items-center justify-center p-4 cursor-pointer border-2 transition-colors duration-200 ${
          isLeader 
            ? "h-24 bg-yellow-500 border-yellow-200 hover:bg-yellow-600" 
            : "h-24 bg-indigo-600 border-indigo-400 hover:bg-indigo-500"
        }`}
        variants={cardVariants}
        initial="rest"
        animate={isAnimating ? "rest" : "float"}
        whileHover={!isAnimating ? "hover" : {}}
        style={{
          boxShadow: isLeader 
            ? "0 4px 20px rgba(99, 102, 241, 0.3)" 
            : "0 2px 10px rgba(99, 102, 241, 0.2)"
        }}
      >
        <span className={`font-bold text-white text-center ${
          isLeader ? "text-lg" : "text-md"
        }`}>
          {name}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default StudyGroupCard;