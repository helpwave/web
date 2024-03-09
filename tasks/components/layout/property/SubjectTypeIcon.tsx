import type { LucideProps } from 'lucide-react'
import { Bed, Church, Cuboid, Landmark, UserRound } from 'lucide-react'
import type { SubjectType } from '@/components/layout/property/property'

export type SubjectTypeIconProps = {
  subjectType: SubjectType
} & LucideProps

export const SubjectTypeIcon = ({ subjectType, ...props }: SubjectTypeIconProps) => {
  switch (subjectType) {
    case 'organization': return (<Landmark {...props} />)
    case 'ward': return (<Church {...props} />)
    case 'room': return (<Cuboid {...props} />)
    case 'bed': return (<Bed {...props} />)
    case 'patient': return (<UserRound {...props} />)
  }
}
