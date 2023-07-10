import { tw } from '@helpwave/common/twind'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import { PillLabelsColumn } from '../pill/PillLabelsColumn'
import { Span } from '@helpwave/common/components/Span'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'

type PatientCardTranslation = {
  bedName: string
}

const defaultPatientCardTranslation: Record<Languages, PatientCardTranslation> = {
  en: {
    bedName: 'Bed'
  },
  de: {
    bedName: 'Bett'
  }
}

export type PatientCardProps = CardProps & {
  bedIndex: number,
  patientName: string,
  unscheduledTasks: number,
  inProgressTasks: number,
  doneTasks: number
}

/**
 * A Card for displaying a Patient and the tasks
 */
export const PatientCard = ({
  language,
  bedIndex,
  patientName,
  unscheduledTasks,
  inProgressTasks,
  doneTasks,
  isSelected,
  onTileClick,
}: PropsWithLanguage<Languages, PatientCardProps>) => {
  const translation = useTranslation(language, defaultPatientCardTranslation)
  return (
    <Card isSelected={isSelected} onTileClick={onTileClick}>
      <div className={tw('flex flex-row justify-between')}>
        <Span type="subsubsectionTitle">{`${translation.bedName} ${bedIndex}`}</Span>
        <Span>{patientName}</Span>
      </div>
      <div className={tw('w-7/12 min-w-[150px] mt-1')}>
        <PillLabelsColumn
          doneCount={doneTasks}
          inProgressCount={inProgressTasks}
          unscheduledCount={unscheduledTasks}
        />
      </div>
    </Card>
  )
}
