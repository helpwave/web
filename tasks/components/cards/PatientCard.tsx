
import type { Translation } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { PillLabelsColumn } from '../pill/PillLabelsColumn'
import { DragCard, type DragCardProps } from './DragCard'
import clsx from 'clsx'

type PatientCardTranslation = {
  bedNotAssigned: string,
}

const defaultPatientCardTranslations: Translation<PatientCardTranslation> = {
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
  onClick,
  className,
  ...restCardProps
}: PropsForTranslation<PatientCardTranslation, PatientCardProps>) => {
  const translation = useTranslation(defaultPatientCardTranslations, overwriteTranslation)
  return (
    <DragCard isSelected={isSelected} onClick={onClick} className={clsx('min-h-40',className)} {...restCardProps}>
      <div className="row justify-between">
        <span className="textstyle-title-sm whitespace-nowrap" >{bedName ?? translation.bedNotAssigned}</span>
        <span className="ml-2 truncate">{patientName}</span>
      </div>
      <div className="min-w-[150px] max-w-[200px] mt-1">
        <PillLabelsColumn
          doneCount={doneTasks}
          inProgressCount={inProgressTasks}
          unscheduledCount={unscheduledTasks}
        />
      </div>
    </DragCard>
  )
}
