import clsx from 'clsx'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Chip } from '@helpwave/common/components/ChipList'
import { EditCard, type EditCardProps } from './EditCard'

type TaskTemplateCardTranslation = {
  subtask: string,
  edit: string,
  personal: string,
  ward: string,
}

const defaultTaskTemplateCardTranslations: Record<Languages, TaskTemplateCardTranslation> = {
  en: {
    subtask: 'Subtasks',
    edit: 'Edit',
    personal: 'Personal',
    ward: 'Ward'
  },
  de: {
    subtask: 'Unteraufgaben',
    edit: 'Bearbeiten',
    personal: 'Persönlich',
    ward: 'Station'
  }
}

export type TaskTemplateCardProps = EditCardProps & {
  name: string,
  subtaskCount: number,
  typeForLabel?: 'ward' | 'personal',
}

/**
 * A Card showing a TaskTemplate
 */
export const TaskTemplateCard = ({
  overwriteTranslation,
  name,
  subtaskCount,
  typeForLabel,
  className,
  ...editCardProps
}: PropsForTranslation<TaskTemplateCardTranslation, TaskTemplateCardProps>) => {
  const translation = useTranslation(defaultTaskTemplateCardTranslations, overwriteTranslation)
  return (
    <EditCard
      className={clsx('group flex flex-col bg-white', className)}
      {...editCardProps}
    >
      <div className={clsx('overflow-hidden h-full')}>
        <div className={clsx('flex flex-row items-start overflow-hidden gap-x-1')}>
          <span className={clsx('textstyle-title-sm')}>{name}</span>
          {typeForLabel && (
            <Chip
              color={typeForLabel === 'ward' ? 'hw-label-blue' : 'hw-label-pink'}
              variant="fullyRounded"
            >
              {typeForLabel === 'ward' ? translation.ward : translation.personal}
            </Chip>
          )}
        </div>
        <span>{subtaskCount + ' ' + translation.subtask}</span>
      </div>
    </EditCard>
  )
}
