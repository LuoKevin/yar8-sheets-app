import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
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
 const [displayGroups, setDisplayGroups] = useState(groups);
  const initial = useRef(true);

  // when `groups` changes, just update state
  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      setDisplayGroups(groups);
    } else {
      setDisplayGroups(groups);
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
      <LayoutGroup>
        <motion.div
          layout
          className="grid h-full w-full gap-4"
          style={{ gridTemplateColumns: `repeat(${displayGroups.length},1fr)` }}
          transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
        >
          {displayGroups.map((group) => (
            <motion.div key={group.leader} layout>
              <StudyGroupColumn
                leader={group.leader}
                members={group.members}
              />
            </motion.div>
          ))}
        </motion.div>
      </LayoutGroup>

    </div>
  );
};

export default StudyGroupGrid;