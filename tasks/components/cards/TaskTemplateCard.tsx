import clsx from 'clsx'
import type { Translation } from '@helpwave/hightide'
import { Chip, type PropsForTranslation, useTranslation } from '@helpwave/hightide'
import { EditCard, type EditCardProps } from './EditCard'

type TaskTemplateCardTranslation = {
  subtask: string,
  edit: string,
  personal: string,
  ward: string,
}

const defaultTaskTemplateCardTranslations: Translation<TaskTemplateCardTranslation> = {
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
  const translation = useTranslation([defaultTaskTemplateCardTranslations], overwriteTranslation)
  return (
    <EditCard
      className={clsx('gap-y-0', className)}
      {...editCardProps}
    >
      <div className="col w-full gap-y-0">
        <div className="row items-center justify-between overflow-hidden gap-x-1">
          <span className="typography-title-sm truncate">{name}</span>
          {typeForLabel && (
            <Chip
              color={typeForLabel === 'ward' ? 'red' : 'blue'}
              variant="fullyRounded"
              className="!font-semibold text-xs"
            >
              {typeForLabel === 'ward' ? translation('ward') : translation('personal')}
            </Chip>
          )}
        </div>
        <span>{subtaskCount + ' ' + translation('subtask')}</span>
      </div>
    </EditCard>
  )
}
