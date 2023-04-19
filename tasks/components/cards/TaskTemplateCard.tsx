import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { CardProps } from './Card'
import { Card } from './Card'

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
          <span className={tw('font-bold font-space')}>{name}</span>
          <p>{subtaskCount + ' ' + translation.subtask}</p>
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
