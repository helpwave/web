import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import { Span } from '@helpwave/common/components/Span'

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
      <Card onTileClick={onTileClick} isSelected={isSelected} className={tw('group flex flex-row justify-between')}>
        <div className={tw('flex flex-col items-start')}>
          <Span type="subsubsectionTitle">{name}</Span>
          <Span>{subtaskCount + ' ' + translation.subtask}</Span>
        </div>
        <button
          onClick={event => {
            onEditClick()
            event.stopPropagation()
          }}
          className={tw('hidden group-hover:block')}>{translation.edit}</button>
      </Card>
    )
  }
