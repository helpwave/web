import { tw } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { FunctionComponent } from 'react'
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
  templateName: string,
  subtaskCount: number,
  isSelected: boolean,
  editClickedCallback: () => void,
  tileClickedCallback: () => void
}

const TaskTemplateTile: FunctionComponent<PropsWithLanguage<TaskTemplateTileTranslation, TaskTemplateTileProps>> =
  (props) => {
    const translation = useTranslation(props.language, defaultTaskTemplateTileTranslations)
    // TODO change border color for onHover and selected
    const selectedBorderColor = props.isSelected ? 'border-black' : ''
    return (
      <button onClick={props.tileClickedCallback}
              className={tw(`${selectedBorderColor} group flex flex-row rounded-md py-2 px-4 border hover:border-black justify-between items-center w-full`)}>
        <div className={tw('flex flex-col items-start')}>
          <h5 className={tw('font-bold')}>{props.templateName}</h5>
          <p>{props.subtaskCount.toString() + ' ' + translation.subtask}</p>
        </div>
        <button onClick={props.editClickedCallback} className={tw('hidden group-hover:block')}>{translation.edit}</button>
      </button>
    )
  }

export { TaskTemplateTile }
