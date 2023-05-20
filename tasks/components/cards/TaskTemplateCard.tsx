import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import { Edit } from 'lucide-react'
import { Span } from '@helpwave/common/components/Span'
import { Label } from '../Label'

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

export type TaskTemplateCardProps = CardProps & {
  name: string,
  subtaskCount: number,
  onEditClick?: () => void,
  typeForLabel?: 'ward' | 'personal'
}

/**
 * A Card showing a TaskTemplate
 */
export const TaskTemplateCard = ({
  isSelected = false,
  name,
  subtaskCount,
  language,
  onTileClick = () => undefined,
  onEditClick,
  className,
  typeForLabel
}: PropsWithLanguage<TaskTemplateCardTranslation, TaskTemplateCardProps>) => {
  const translation = useTranslation(language, defaultTaskTemplateCardTranslations)
  return (
    <Card
      onTileClick={onTileClick}
      isSelected={isSelected}
      className={tx('group flex flex-col bg-white', className)}
    >
      <div className={tw('flex flex-row items-start overflow-hidden gap-x-1')}>
        <Span type="subsubsectionTitle" className={tw('!flex-1')}>{name}</Span>
        {typeForLabel && (
          <Label
            name={typeForLabel === 'ward' ? translation.ward : translation.personal}
            color={typeForLabel === 'ward' ? 'blue' : 'pink'}
          />
        )}
        {onEditClick && (
          <button
            onClick={event => {
              onEditClick()
              event.stopPropagation()
            }}
            className={tw('text-transparent group-hover:text-black')}
          >
            <Edit size={24}/>
          </button>
        )}
      </div>
      <Span>{subtaskCount + ' ' + translation.subtask}</Span>
    </Card>
  )
}
