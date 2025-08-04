import { useEffect, useState } from 'react'
import { CareGroup } from '../../api/sheet'
import { motion, LayoutGroup } from 'framer-motion'
import CareGroupCluster from './CareGroupCluster'

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
        <LayoutGroup>
          <motion.div
            layout
            className="grid gap-6 justify-center mx-auto"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              maxWidth: '1280px',
            }}
            transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 } }}
          >
            {currentGroups.map((group, index) => (
              <motion.div key={index} layout>
                <CareGroupCluster group={group} />
              </motion.div>
            ))}
          </motion.div>
        </LayoutGroup>
      </div>
    </div>
  )
}

export default CareGroupsDisplay
