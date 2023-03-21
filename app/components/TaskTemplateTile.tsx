import { tw } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { CardProps } from './Card'
import { Card } from './Card'

type TaskTemplateTileTranslation = {
  subtask: string,
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

export type TaskTemplateTileProps = {
  name: string,
  subtaskCount: number,
  onEditClicked?: () => void
} & CardProps

export const TaskTemplateTile =
  ({
    isSelected = false,
    name,
    subtaskCount,
    language,
    onTileClicked = () => undefined,
    onEditClicked = () => undefined
  }: PropsWithLanguage<TaskTemplateTileTranslation, TaskTemplateTileProps>) => {
    const translation = useTranslation(language, defaultTaskTemplateTileTranslations)
    return (
      <Card onTileClicked={onTileClicked} isSelected={isSelected} classes={['group flex flex-row justify-between']}>
        <div className={tw('flex flex-col items-start')}>
          <span className={tw('font-bold font-space')}>{name}</span>
          <p>{subtaskCount + ' ' + translation.subtask}</p>
        </div>
        <button onClick={onEditClicked}
                className={tw('hidden group-hover:block')}>{translation.edit}</button>
      </Card>
    )
  }
