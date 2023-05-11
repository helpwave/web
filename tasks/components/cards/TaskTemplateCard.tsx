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
      className={tx('group flex flex-row justify-between items-start bg-white', className)}
    >
      <div className={tw('flex flex-col items-start')}>
        <Span type="subsubsectionTitle">{name}</Span>
        {typeForLabel && (
          <Label
            name={typeForLabel === 'ward' ? translation.ward : translation.personal}
            color={typeForLabel === 'ward' ? 'blue' : 'pink'}
          />
        )}
        <Span>{subtaskCount + ' ' + translation.subtask}</Span>
      </div>
      <div className={tw('flex flex-col items-start')}>
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
    </Card>
  )
}
