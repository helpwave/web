import { tw } from '@helpwave/common/twind'
import { PillLabelsColumn } from '../pill/PillLabelsColumn'
import { Span } from '@helpwave/common/components/Span'
import type { DragCardProps } from './DragCard'
import { DragCard } from './DragCard'

export type PatientCardProps = DragCardProps & {
  bedName: string,
  patientName: string,
  unscheduledTasks?: number,
  inProgressTasks?: number,
  doneTasks?: number
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
  ...restCardProps
}: PatientCardProps) => {
  return (
    <DragCard isSelected={isSelected} onTileClick={onTileClick} {...restCardProps}>
      <div className={tw('flex flex-row justify-between')}>
        <Span className={tw('whitespace-nowrap')} type="subsubsectionTitle">{bedName}</Span>
        <Span className={tw('ml-2 truncate')}>{patientName}</Span>
      </div>
      <div className={tw('min-w-[150px] max-w-[200px] mt-1')}>
        <PillLabelsColumn
          doneCount={doneTasks}
          inProgressCount={inProgressTasks}
          unscheduledCount={unscheduledTasks}
        />
      </div>
    </DragCard>
  )
}
