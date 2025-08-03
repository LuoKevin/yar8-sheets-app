import { CareGroup } from '../../api/sheet'
import CareGroupNameCard from './CareGroupNameCard'

interface CareGroupClusterProps {
  group: CareGroup
}

const CareGroupCluster = ({ group }: CareGroupClusterProps) => {
  return (
    <div>
      {group.members.map((name, i) => (
        <CareGroupNameCard name={name} present={group.attendance[i]} />
      ))}
    </div>
  )
}

export default CareGroupCluster
