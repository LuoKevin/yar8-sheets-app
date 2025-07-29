import { motion } from "framer-motion"
import StudyGroupCard from "./StudyGroupCard"

interface StudyGroupColumnProps {
  leader: string;
  members: string[];
  isAnimating?: boolean;
}

const StudyGroupColumn = ({ leader, members, isAnimating }: StudyGroupColumnProps) => {
	return (
		<motion.div 
			className="flex flex-col items-center mx-2 space-y-2 pt-6"
			layout
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{
				type: "spring",
				stiffness: 150,
				damping: 15,
				delay: 0.2
			}}
		>
			<StudyGroupCard 
				name={leader} 
				isLeader 
				isAnimating={isAnimating} 
			/>
      
			<div className="flex flex-col items-center">
				{members.map((member) => (
					<StudyGroupCard 
						key={member} 
						name={member} 
						isAnimating={isAnimating} 
					/>
				))}
			</div>
		</motion.div>
	)
}

export default StudyGroupColumn