import type { Translation } from '@helpwave/hightide'
import { type PropsForTranslation, useTranslation } from '@helpwave/hightide'
import { PillLabelsColumn } from '../PillLabel'
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

type TaskCounts = {
  todo: number,
  inProgress: number,
  done: number,
}

export type PatientCardProps = DragCardProps & {
  bedName?: string,
  patientName: string,
  taskCounts?: TaskCounts,
}

/**
 * A Card for displaying a Patient and the tasks
 */
export const PatientCard = ({
                              overwriteTranslation,
                              bedName,
                              patientName,
                              taskCounts,
                              isSelected,
                              onClick,
                              className,
                              ...restCardProps
                            }: PropsForTranslation<PatientCardTranslation, PatientCardProps>) => {
  const translation = useTranslation([defaultPatientCardTranslations], overwriteTranslation)
  return (
    <DragCard isSelected={isSelected} onClick={onClick} className={clsx('min-h-40', className)} {...restCardProps}>
      <div className="row justify-between">
        <span className="textstyle-title-normal whitespace-nowrap">{bedName ?? translation('bedNotAssigned')}</span>
        <span className="ml-2 truncate">{patientName}</span>
      </div>
      {taskCounts && (
        <div className="min-w-[150px] max-w-[200px] mt-1">
          <PillLabelsColumn
            doneCount={taskCounts.done}
            inProgressCount={taskCounts.inProgress}
            todoCount={taskCounts.todo}
          />
        </div>
      )}
    </DragCard>
  )
}
