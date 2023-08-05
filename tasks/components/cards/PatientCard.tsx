import { tw } from '@helpwave/common/twind'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import { PillLabelsColumn } from '../pill/PillLabelsColumn'
import { Span } from '@helpwave/common/components/Span'

export type PatientCardProps = CardProps & {
  bedName: string,
  patientName: string,
  unscheduledTasks: number,
  inProgressTasks: number,
  doneTasks: number
}

/**
 * A Card for displaying a Patient and the tasks
 */
export const PatientCard = ({
  bedName,
  patientName,
  unscheduledTasks,
  inProgressTasks,
  doneTasks,
  isSelected,
  onTileClick,
}: PatientCardProps) => {
  return (
    <Card isSelected={isSelected} onTileClick={onTileClick}>
      <div className={tw('flex flex-row justify-between')}>
        <Span className={tw('whitespace-nowrap')} type="subsubsectionTitle">{bedName}</Span>
        <span className={tw('ml-2 text-ellipsis overflow-hidden block  whitespace-nowrap')}>{patientName}</span>
      </div>
      <div className={tw('min-w-[150px] max-w-[200px] mt-1')}>
        <PillLabelsColumn
          doneCount={doneTasks}
          inProgressCount={inProgressTasks}
          unscheduledCount={unscheduledTasks}
        />
      </div>
    </Card>
  )
}
