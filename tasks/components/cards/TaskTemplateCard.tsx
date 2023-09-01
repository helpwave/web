import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Span } from '@helpwave/common/components/Span'
import { Label } from '../Label'
import type { EditCardProps } from './EditCard'
import { EditCard } from './EditCard'

type TaskTemplateCardTranslation = {
  subtask: string,
  edit: string,
  personal: string,
  ward: string
}

const defaultTaskTemplateCardTranslations: Record<Languages, TaskTemplateCardTranslation> = {
  en: {
    subtask: 'Subtasks',
    edit: 'Edit',
    personal: 'Personal',
    ward: 'Ward'
  },
  de: {
    subtask: 'Unteraufgabe',
    edit: 'Bearbeiten',
    personal: 'Persönlich',
    ward: 'Station'
  }
}

export type TaskTemplateCardProps = EditCardProps & {
  name: string,
  subtaskCount: number,
  typeForLabel?: 'ward' | 'personal'
}

/**
 * A Card showing a TaskTemplate
 */
export const TaskTemplateCard = ({
  language,
  name,
  subtaskCount,
  typeForLabel,
  className,
  ...editCardProps
}: PropsWithLanguage<TaskTemplateCardTranslation, TaskTemplateCardProps>) => {
  const translation = useTranslation(language, defaultTaskTemplateCardTranslations)
  return (
    <EditCard
      className={tx('group flex flex-col bg-white', className)}
      {...editCardProps}
    >
      <div className={tw('overflow-hidden h-full')}>
        <div className={tw('flex flex-row items-start overflow-hidden gap-x-1')}>
          <Span type="subsubsectionTitle" className={tw('!flex-1')}>{name}</Span>
          {typeForLabel && (
            <Label
              name={typeForLabel === 'ward' ? translation.ward : translation.personal}
              color={typeForLabel === 'ward' ? 'blue' : 'pink'}
            />
          )}
        </div>
        <Span>{subtaskCount + ' ' + translation.subtask}</Span>
      </div>
    </EditCard>
  )
}
