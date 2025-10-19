import { useEffect, useState } from 'react'
import { CareGroup } from '../../api/sheet.ts'
import { motion, LayoutGroup } from 'framer-motion'
import CareGroupColumn from './CareGroupColumn.tsx'

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
                className="grid gap-4 grid-cols-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
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
