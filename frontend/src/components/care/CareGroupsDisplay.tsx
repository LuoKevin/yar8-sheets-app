import { useEffect, useState } from 'react'
import { CareGroup } from '../../api/sheet'
import { motion, LayoutGroup } from 'framer-motion'
import CareGroupColumn from './CareGroupColumn'

interface CareGroupsDisplayProps {
  groups: CareGroup[]
}

const CareGroupsDisplay = ({ groups }: CareGroupsDisplayProps) => {
  const [currentGroups, setCurrentGroups] = useState<CareGroup[]>([])
  useEffect(() => {
    setCurrentGroups(groups)
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
                initial={{ opacity: 0, y: '100vh' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: 'tween',
                  ease: 'easeInOut',
                  stiffness: 150,
                  damping: 15,
                  delay: 0.2,
                }}
              >
                {currentGroups.map((group, index) => (
                  <motion.div key={index} layout>
                    <CareGroupColumn group={group} />
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
