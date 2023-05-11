import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import { Edit } from 'lucide-react'
import { Span } from '@helpwave/common/components/Span'
import type { LabelProps } from '../Label'
import { Label } from '../Label'

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
  onEditClick?: () => void,
  label?: LabelProps
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
  label
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
          <Span>{subtaskCount + ' ' + translation.subtask}</Span>
        </div>
        <div className={tw('flex flex-col items-start')}>
          {label && (<Label {...label}/>)}
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
