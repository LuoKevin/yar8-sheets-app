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
    <div className="relative z-10 mx-auto w-full">
      <LayoutGroup>
        <motion.div
          layout
          className="flex w-full flex-wrap items-stretch justify-center gap-[clamp(0.5rem,1.25vw,1rem)]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25 }}
        >
          {currentGroups.map((group, index) => (
            <motion.div
              key={index}
              layout
              className="min-w-[10rem] max-w-sm flex-1 basis-[clamp(10rem,18vw,15rem)]"
            >
              <CareGroupColumn group={group} />
            </motion.div>
          ))}
        </motion.div>
      </LayoutGroup>
    </div>
  )
}

export default CareGroupsDisplay
