import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import { Edit } from 'lucide-react'

type TaskTemplateCardTranslation = {
  subtask: string,
  edit: string
}

const defaultTaskTemplateCardTranslations: Record<Languages, TaskTemplateCardTranslation> = {
  en: {
    subtask: 'Subtasks',
    edit: 'Edit'
  },
  de: {
    subtask: 'Unteraufgabe',
    edit: 'Bearbeiten'
  }
}

export type TaskTemplateCardProps = CardProps & {
  name: string,
  subtaskCount: number,
  onEditClick?: () => void
}

/**
 * A Card showing a TaskTemplate
 */
export const TaskTemplateCard =
  ({
    isSelected = false,
    name,
    subtaskCount,
    language,
    onTileClick = () => undefined,
    onEditClick = () => undefined
  }: PropsWithLanguage<TaskTemplateCardTranslation, TaskTemplateCardProps>) => {
    const translation = useTranslation(language, defaultTaskTemplateCardTranslations)
    return (
      <Card onTileClick={onTileClick} isSelected={isSelected} className={tw('group flex flex-row justify-between items-start')}>
        <div className={tw('flex flex-col items-start')}>
          <span className={tw('font-bold font-space')}>{name}</span>
          <p>{subtaskCount + ' ' + translation.subtask}</p>
        </div>
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
      </Card>
    )
  }
