import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState, useEffect } from "react";

type NameGridProps = {
  initialNames?: string[];
};

const NameGrid = ({ initialNames }: NameGridProps) => {
  const [names, setNames] = useState<string[]>(
    initialNames || [
      "Emma", "Liam", "Olivia", "Noah", "Ava",
      "William", "Sophia", "James", "Isabella", "Benjamin"
    ]
  );

  // Track positions for directional effects
  const [positions, setPositions] = useState<{ [key: string]: { x: number, y: number } }>({});
  const [isAnimating, setIsAnimating] = useState(false);

  // More aggressive animation variants
  const cardVariants = {
    rest: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
    hover: {
      y: -10,
      scale: 1.1,
      transition: {
        duration: 0.2,
      },
    },
    float: {
      y: [0, -8, 0] as [number, number, number],
      rotate: [-2, 2, -2] as [number, number, number],
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

  // Calculate aggressive rotation and position offsets
  const getMovementEffects = (name: string, index: number) => {
    const prevPos = positions[name] || { x: 0, y: 0 };
    const direction = {
      x: Math.random() > 0.5 ? 1 : -1,
      y: Math.random() > 0.5 ? 1 : -1
    };
    
    return {
      initial: {
        x: prevPos.x * 30,
        y: prevPos.y * 30,
        rotate: direction.x * 45,
        opacity: 0.7
      },
      animate: {
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1
      }
    };
  };

  // Shuffle with aggressive movement
  const shuffleNames = (): void => {
    setIsAnimating(true);
    
    // Record current positions as offsets
    const newPositions: { [key: string]: { x: number, y: number } } = {};
    names.forEach((name, index) => {
      newPositions[name] = {
        x: Math.random() * 2 - 1, // Random between -1 and 1
        y: Math.random() * 2 - 1
      };
    });
    setPositions(newPositions);

    // Perform shuffle after a small delay
    setTimeout(() => {
      setNames(currentNames => {
        const shuffled = [...currentNames];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      });
      setIsAnimating(false);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Aggressive Name Grid
      </h1>

      <div className="flex justify-center mb-8">
        <button
          onClick={shuffleNames}
          disabled={isAnimating}
          className={`px-6 py-2 rounded-lg shadow transition-colors ${
            isAnimating 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isAnimating ? "Shuffling..." : "Shuffle Names"}
        </button>
      </div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4 w-full max-w-6xl mx-auto"
        layout
      >
        {names.map((name, index) => {
          const effects = getMovementEffects(name, index);
          
          return (
            <motion.div
              key={name}
              className="h-36 perspective-1000 origin-center"
              layout
              initial={effects.initial}
              animate={effects.animate}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                rotate: {
                  type: "spring",
                    stiffness: 80 + Math.random() * 40,
                    damping: 8 + Math.random() * 4,
                    velocity: 10 + Math.random() * 10
                },
                opacity: { duration: 0.4 }
              }}
              whileHover={!isAnimating ? { scale: 1.05 } : {}}
            >
              <motion.div
                className="h-full w-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg flex items-center justify-center p-4 cursor-pointer transform-style-preserve-3d border-2 border-white"
                variants={cardVariants}
                initial="rest"
                animate="float"
                whileHover="hover"
                transition={{
                  rotate: {
                    type: "spring",
                    stiffness: 50,
                    damping: 5
                  }
                }}
              >
                <span className="font-bold text-blue-900 text-center text-lg">
                  {name}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default NameGrid;