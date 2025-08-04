import { CareGroup } from '../../api/sheet'
import CareGroupNameCard from './CareGroupNameCard'

interface CareGroupClusterProps {
  group: CareGroup
}

const CareGroupCluster = ({ group }: CareGroupClusterProps) => {
  const MAX_CARDS = 9
  const filledCards = group.members.map((name, i) => (
    <CareGroupNameCard key={name} name={name} present={group.attendance[i]} />
  ))

  const emptyCards = Array.from({ length: MAX_CARDS - group.members.length }).map((_, idx) => (
    <div key={`placeholder-${idx}`} className="invisible">
      <CareGroupNameCard name="placeholder" present={false} />
    </div>
  ))

  return (
    <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-white/10 backdrop-blur-sm shadow-md min-h-[300px]">
      {filledCards}
      {emptyCards}
    </div>
  )
}

export default CareGroupCluster
