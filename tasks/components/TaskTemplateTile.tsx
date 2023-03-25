import { tw } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { CardProps } from './Card'
import { Card } from './Card'

type TaskTemplateTileTranslation = {
  subtask: string
  edit: string
}

const defaultTaskTemplateTileTranslations: Record<Languages, TaskTemplateTileTranslation> = {
  en: {
    subtask: 'Subtasks',
    edit: 'Edit'
  },
  de: {
    subtask: 'Unteraufgabe',
    edit: 'Bearbeiten'
  }
}

export type TaskTemplateTileProps = CardProps & {
  name: string
  subtaskCount: number
  onEditClick?: () => void
}

export const TaskTemplateTile = ({
  isSelected = false,
  name,
  subtaskCount,
  language,
  onTileClick = () => undefined,
  onEditClick = () => undefined
}: PropsWithLanguage<TaskTemplateTileTranslation, TaskTemplateTileProps>) => {
  const translation = useTranslation(language, defaultTaskTemplateTileTranslations)
  return (
    <Card onTileClick={onTileClick} isSelected={isSelected} className={tw('group flex flex-row justify-between')}>
      <div className={tw('flex flex-col items-start')}>
        <span className={tw('font-bold font-space')}>{name}</span>
        <p>{subtaskCount + ' ' + translation.subtask}</p>
      </div>
      <button onClick={onEditClick} className={tw('hidden group-hover:block')}>
        {translation.edit}
      </button>
    </Card>
  )
}
