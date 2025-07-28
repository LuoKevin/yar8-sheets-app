import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import StudyGroupColumn from "./StudyGroupColumn"
import LoadingIndicator from "./LoadingIndicator";
import { StudyGroup } from "../api/sheet";

interface StudyGroupGridProps {
  groups: StudyGroup[];
  loading: boolean
  error: string | null
}

const StudyGroupGrid = ({ groups, loading, error }: StudyGroupGridProps) => {
	const [displayGroups, setDisplayGroups] = useState(groups)
	const initial = useRef(true)

	// when `groups` changes, just update state
	useEffect(() => {
		if (initial.current) {
			initial.current = false
			setDisplayGroups(groups)
		} else {
			setDisplayGroups(groups)
		}
	}, [groups])

	if(displayGroups.length == 0) return null

	return (
    
		<div className="relative z-10 min-h-screen flex flex-col items-center justify-top p-4">
			{/* Loading Overlay */}
			<LoadingIndicator isLoading={loading} />
			{/* Main Grid */}
			<LayoutGroup>
				<motion.div
					layout
					className="grid h-full w-full gap-4"
					style={{ gridTemplateColumns: `repeat(${displayGroups.length},1fr)` }}
					transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
				>
					{displayGroups.map((group) => (
						<motion.div key={group.leader.name} layout>
							<StudyGroupColumn
								leader={group.leader.name}
								members={group.members.map((mem) => mem.name)}
							/>
						</motion.div>
					))}
				</motion.div>
			</LayoutGroup>

		</div>
	)
}

export default StudyGroupGrid