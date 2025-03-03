import { tw } from '@helpwave/color-themes/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { PillLabelsColumn } from '../pill/PillLabelsColumn'
import { DragCard, type DragCardProps } from './DragCard'

type PatientCardTranslation = {
  bedNotAssigned: string,
}

const defaultPatientCardTranslations: Record<Languages, PatientCardTranslation> = {
  en: {
    bedNotAssigned: 'Not Assigned',
  },
  de: {
    bedNotAssigned: 'Nicht Zugewiesen',
  }
}

export type PatientCardProps = DragCardProps & {
  bedName?: string,
  patientName: string,
  unscheduledTasks?: number,
  inProgressTasks?: number,
  doneTasks?: number,
}

/**
 * A Card for displaying a Patient and the tasks
 */
export const PatientCard = ({
  overwriteTranslation,
  bedName,
  patientName,
  unscheduledTasks,
  inProgressTasks,
  doneTasks,
  isSelected,
  onTileClick,
  ...restCardProps
}: PropsForTranslation<PatientCardTranslation, PatientCardProps>) => {
  const translation = useTranslation(defaultPatientCardTranslations, overwriteTranslation)
  return (
    <DragCard isSelected={isSelected} onTileClick={onTileClick} {...restCardProps}>
      <div className={tw('flex flex-row justify-between')}>
        <span className={tw('textstyle-title-sm whitespace-nowrap')} >{bedName ?? translation.bedNotAssigned}</span>
        <span className={tw('ml-2 truncate')}>{patientName}</span>
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
