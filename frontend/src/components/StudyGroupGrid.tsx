import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import StudyGroupColumn from "./StudyGroupColumn";

interface StudyGroup {
  leader: string;
  members: string[];
}

interface StudyGroupGridProps {
  groups: StudyGroup[];
  loading: boolean
  error: string | null
}

const StudyGroupGrid = ({ groups, loading, error }: StudyGroupGridProps) => {
  const [displayGroups, setDisplayGroups] = useState<StudyGroup[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      // Set initial groups without animation on first render
      setDisplayGroups(groups);
      initialRender.current = false;
    } else {
      // Only animate when groups actually change
      if (JSON.stringify(groups) !== JSON.stringify(displayGroups)) {
        const animateGroupChange = async () => {
          setIsAnimating(true);
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait for exit animations
          setDisplayGroups(groups);
          setIsAnimating(false);
        };
        animateGroupChange();
      }
    }
  }, [groups]);

  if(displayGroups.length == 0) return null

  return (
    
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
    {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 backdrop-blur-sm z-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-16 h-16 border-4 border-white/80 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
        {/* Main Grid */}
      <AnimatePresence mode="wait">
      <motion.div
      key= {`${isAnimating}`}
        className="flex justify-center w-full px-4 py-8 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 150,
          damping: 15,
          delay: 0.2
        }}
        exit={{
            opacity: 0
        }}
      >
        <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl">
          <AnimatePresence mode="wait">
            {displayGroups.map((group, index) => (
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
    </AnimatePresence>

    </div>
  );
};

export default StudyGroupGrid;