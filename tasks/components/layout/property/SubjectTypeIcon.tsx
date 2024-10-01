import type { LucideProps } from 'lucide-react'
import { NotepadText, UserRound } from 'lucide-react'
import type { SubjectType } from '@helpwave/api-services/types/properties/property'

export type SubjectTypeIconProps = {
  subjectType: SubjectType
} & LucideProps

export const SubjectTypeIcon = ({ subjectType, ...props }: SubjectTypeIconProps) => {
  switch (subjectType) {
    /*
    case 'organization': return (<Landmark {...props} />)
    case 'ward': return (<Church {...props} />)
    case 'room': return (<Cuboid {...props} />)
    case 'bed': return (<Bed {...props} />)
     */
    case 'patient': return (<UserRound {...props} />)
    case 'task': return (<NotepadText {...props} />)
  }
}
