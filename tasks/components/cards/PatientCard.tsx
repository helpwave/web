import { tw } from '@helpwave/common/twind'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import { PillLabelsColumn } from '../pill/PillLabelsColumn'
import type { PatientDTO } from '../../mutations/room_mutations'
import { Span } from '@helpwave/common/components/Span'

type BedDTO = {
  name: string,
  patient?: PatientDTO
}

export type PatientCardProps = CardProps & {
  bed: BedDTO,
  patient: PatientDTO
}

/**
 * A Card for displaying a Patient and the tasks
 */
export const PatientCard = ({
  bed,
  patient,
  isSelected,
  onTileClick,
}: PatientCardProps) => {
  return (
    <Card isSelected={isSelected} onTileClick={onTileClick}>
      <div className={tw('flex flex-row justify-between')}>
        <Span type="subsubsectionTitle">{bed.name}</Span>
        <Span>{patient.humanReadableIdentifier}</Span>
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
