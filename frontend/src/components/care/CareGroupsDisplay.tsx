import { useEffect, useState } from "react"
import { CareGroup } from "../../api/sheet"
import LoadingIndicator from "../LoadingIndicator"
import StudyGroupColumn from "../study/StudyGroupColumn"
import { motion, LayoutGroup } from 'framer-motion'
import CareGroupCluster from "./CareGroupCluster"

interface CareGroupsDisplayProps {
    groups: CareGroup[]
}

const CareGroupsDisplay = ({ groups }: CareGroupsDisplayProps) => {
    const [currentGroups, setCurrentGroups] = useState<CareGroup[]>([])
  useEffect(() => {
    setCurrentGroups(groups)
    console.log(currentGroups)
  }, [groups])

  return (
    <div className="relative z-10 min-h-screen w-full px-2 sm:px-4">
      {/* Main Display */}
      <div className="w-full pt-4">
        <div className="min-w-full overflow-x-auto">
          <div className="pl-4 sm:pl-0 w-max mx-auto">
            <LayoutGroup>
              <motion.div
                layout
                className="grid gap-4 auto-cols-[minmax(150px,1fr)] grid-flow-col"
                style={{ width: 'max-content' }} // allows full natural width
                transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 } }}
              >
                
                {currentGroups.map((group) => (
                  <motion.div layout>
                    <CareGroupCluster group={group} />
                  </motion.div>
                ))}
              </motion.div>
            </LayoutGroup>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CareGroupsDisplay