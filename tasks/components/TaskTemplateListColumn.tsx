import { useState } from 'react'
import { tw } from '@helpwave/common/twind/index'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Plus as Add } from 'lucide-react'
import { TaskTemplateCard } from './cards/TaskTemplateCard'

export type TaskTemplateListColumnTranslation = {
  addNewTaskTemplate: string,
  wardTemplate: string,
  personalTemplate: string
}

const defaultTaskTemplateListColumnTranslation = {
  de: {
    addNewTaskTemplate: 'Neue Vorlage hinzufügen',
    wardTemplate: 'Stations Vorlagen',
    personalTemplate: 'Persönliche Vorlagen'
  },
  en: {
    addNewTaskTemplate: 'Add new template',
    wardTemplate: 'Ward Templates',
    personalTemplate: 'Personal Templates'
  }
}

type TaskTemplateDTO = {
  name: string,
  subtaskCount: number
}

export type TaskTemplateListColumnProps = {
  isWardTemplateColumn: boolean,
  taskTemplates: TaskTemplateDTO[]
}

export const TaskTemplateListColumn = ({
  language,
  taskTemplates,
  isWardTemplateColumn
}: PropsWithLanguage<TaskTemplateListColumnTranslation, TaskTemplateListColumnProps>) => {
  const [selected, setSelected] = useState<TaskTemplateDTO | undefined>(undefined)
  const translation = useTranslation(language, defaultTaskTemplateListColumnTranslation)

  // TODO update with opening of the create template screen
  const addNewTask = () => undefined

  const onTileClicked = (taskTemplate: TaskTemplateDTO) => {
    // TODO open template edit screen
    setSelected(taskTemplate)
  }

  // TODO action on clicking the template tile
  const onEditClicked = (taskTemplate: TaskTemplateDTO) => taskTemplate

  return (
    <div>
      <div className={tw('flex flex-row items-center')}>
        <div className={tw('w-2 h-2 mx-2 rounded-full bg-gray-300')}/>
        <span className={tw('font-bold')}>
          {isWardTemplateColumn ? translation.wardTemplate : translation.personalTemplate}
        </span>
      </div>
      {taskTemplates.map(taskTemplate => (
          <div key={taskTemplate.name} className={tw('my-2')}>
            <TaskTemplateCard
              name={taskTemplate.name}
              subtaskCount={taskTemplate.subtaskCount}
              isSelected={selected === taskTemplate}
              onEditClick={() => onEditClicked(taskTemplate)}
              onTileClick={() => onTileClicked(taskTemplate)}
            />
          </div>
      )
      )}
      <div onClick={addNewTask}
           className={tw('flex flex-row w-full h-16 rounded-md border-2 hover:border-hw-primary-700 items-center justify-center cursor-pointer mt-4')}>
        <Add />
        <span className={tw('ml-2')}>{translation.addNewTaskTemplate}</span>
      </div>
    </div>
  )
}
