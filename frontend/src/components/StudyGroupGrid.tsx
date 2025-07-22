import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import StudyGroupColumn from "./StudyGroupColumn";

interface StudyGroup {
  leader: string;
  members: string[];
}

interface StudyGroupGridProps {
  groups: StudyGroup[];
}

const StudyGroupGrid = ({ groups }: StudyGroupGridProps) => {
  const [currentGroups, setCurrentGroups] = useState(groups);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (JSON.stringify(groups) !== JSON.stringify(currentGroups)) {
      const animateGroupChange = async () => {
        setIsAnimating(true);
        setCurrentGroups(groups);
        setTimeout(() => setIsAnimating(false), 1000);
      };
      animateGroupChange();
    }
  }, [groups]);

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
      {/* Main grid container with slide-up animation */}
      <motion.div
        className="flex justify-center w-full px-4 py-8 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
        initial={{ opacity: 0, y: "100vh" }} // Starts below viewport
        animate={{ opacity: 1, y: 0 }} // Slides up to normal position
        transition={{ 
          type: "spring",
          stiffness: 60,
          damping: 15,
          delay: 0.2
        }}
      >
        {/* Columns container - now with vertical alignment */}
        <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl">
          <AnimatePresence mode="popLayout">
            {currentGroups.map((group, index) => (
              <StudyGroupColumn
                key={`${group.leader}-${index}`}
                leader={group.leader}
                members={group.members}
                isAnimating={isAnimating}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
      
    </div>
  );
};

export default StudyGroupGrid;