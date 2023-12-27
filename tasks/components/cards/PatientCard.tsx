import { tw } from '@helpwave/common/twind'
import { Span } from '@helpwave/common/components/Span'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { PillLabelsColumn } from '../pill/PillLabelsColumn'
import { DragCard, type DragCardProps } from './DragCard'

type PatientCardTranslation = {
  bedNotAssigned: string
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
  doneTasks?: number
}

/**
 * A Card for displaying a Patient and the tasks
 */
export const PatientCard = ({
  language,
  bedName,
  patientName,
  unscheduledTasks,
  inProgressTasks,
  doneTasks,
  isSelected,
  onTileClick,
  ...restCardProps
}: PropsWithLanguage<PatientCardTranslation, PatientCardProps>) => {
  const translation = useTranslation(language, defaultPatientCardTranslations)
  return (
    <DragCard isSelected={isSelected} onTileClick={onTileClick} {...restCardProps}>
      <div className={tw('flex flex-row justify-between')}>
        <Span className={tw('whitespace-nowrap')} type="subsubsectionTitle">{bedName ?? translation.bedNotAssigned}</Span>
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
