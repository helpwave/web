import { tw } from '@helpwave/common/twind'
import type { CardProps } from './Card'
import { Card } from './Card'
import { PillLabelsColumn } from '../pill/PillLabelsColumn'
import type { PatientDTO } from '../../mutations/room_mutations'

type BedDTO = {
  name: string,
  patient?: PatientDTO
}

export type PatientCardProps = CardProps & {
  bed: BedDTO,
  patient: PatientDTO
}

export const PatientCard = ({
  bed,
  patient,
  isSelected,
  onTileClick,
}: PatientCardProps) => {
  return (
    <Card isSelected={isSelected} onTileClick={onTileClick}>
      <div className={tw('flex flex-row justify-between')}>
        <span className={tw('font-bold font-space')}>{bed.name}</span>
        <span>{patient.humanReadableIdentifier}</span>
      </div>
      <div className={tw('w-7/12 min-w-[150px] mt-1')}>
        <PillLabelsColumn
          doneCount={patient.tasks.filter(value => value.status === 'done').length}
          inProgressCount={patient.tasks.filter(value => value.status === 'inProgress').length}
          unscheduledCount={patient.tasks.filter(value => value.status === 'unscheduled').length}
        />
      </div>
    </Card>
  )
}
