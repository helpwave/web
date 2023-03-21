import { tw } from '@helpwave/common/twind/index'
import type { CardProps } from './Card'
import { Card } from './Card'
import { PillLabelsColumn } from './PillLabelsColumn'

// TODO replace later
type PatientDTO = {
  name: string,
  unscheduled: number,
  inProgress: number,
  done: number
}

// TODO replace later
type BedDTO = {
  name: string
}

export type PatientCardProps = CardProps & {
  bed: BedDTO,
  patient: PatientDTO
}

export const PatientCard = ({
  bed,
  patient,
  isSelected,
  onTileClicked,
}: PatientCardProps) => {
  return (
    <Card isSelected={isSelected} onTileClicked={onTileClicked}>
      <div className={tw('flex flex-row justify-between')}>
        <span className={tw('font-bold font-space')}>{bed.name}</span>
        <span>{patient.name}</span>
      </div>
      <div className={tw('w-7/12 mt-1')}>
        <PillLabelsColumn doneCount={patient.done}
                          inProgressCount={patient.inProgress}
                          unscheduledCount={patient.unscheduled}/>
      </div>
    </Card>
  )
}
