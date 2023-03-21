import { tw, tx } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'

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
  isSelected?: boolean,
  onEditClicked?: () => void,
  onTileClicked?: () => void
}

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
      <button onClick={onTileClicked}
              className={tx('group flex flex-row rounded-md py-2 px-4 border-2 hover:border-hw-primary-700 justify-between items-center w-full', { 'border-hw-primary-700': isSelected })}>
        <div className={tw('flex flex-col items-start')}>
          <span className={tw('font-bold font-space')}>{name}</span>
          <p>{subtaskCount + ' ' + translation.subtask}</p>
        </div>
        <button onClick={onEditClicked}
                className={tw('hidden group-hover:block')}>{translation.edit}</button>
      </button>
    )
  }
