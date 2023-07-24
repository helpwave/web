import { useEffect, useRef, useState } from 'react'
import { tw, tx } from '@helpwave/common/twind'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TaskTemplateCard } from './cards/TaskTemplateCard'
import { Span } from '@helpwave/common/components/Span'
import type { TaskTemplateDTO } from '../mutations/task_template_mutations'
import SimpleBarReact from 'simplebar-react'
import { Edit } from 'lucide-react'

export type TaskTemplateListColumnTranslation = {
  addNewTaskTemplate: string,
  template: string
}

const defaultTaskTemplateListColumnTranslation = {
  de: {
    addNewTaskTemplate: 'Neues Task Template hinzufügen',
    template: 'Templates'
  },
  en: {
    addNewTaskTemplate: 'Add new Task Template',
    template: 'Templates'
  }
}

export type TaskTemplateDTOExtension = {taskTemplate: TaskTemplateDTO, type: 'personal' | 'ward'}

export type TaskTemplateListColumnProps = {
  taskTemplates: TaskTemplateDTOExtension[],
  onTileClick: (taskTemplate: TaskTemplateDTO) => void,
  selectedID?: string,
  onColumnEditClick?: () => void
}

/**
 * A column for showing TaskTemplates either for Ward or Private templates
 */
export const TaskTemplateListColumn = ({
  language,
  taskTemplates,
  onTileClick,
  selectedID = '',
  onColumnEditClick
}: PropsWithLanguage<TaskTemplateListColumnTranslation, TaskTemplateListColumnProps>) => {
  const translation = useTranslation(language, defaultTaskTemplateListColumnTranslation)
  const [height, setHeight] = useState<number | undefined>(undefined)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHeight(ref.current?.clientHeight)
  }, [ref.current?.clientHeight])

  return (
    <div className={tw('flex flex-col overflow-hidden')}>
      <div className={tw('flex flex-row overflow-hidden')}>
        <Span className={tw('text-2xl font-space font-bold mb-4 flex-1')}>
          {translation.template}
        </Span>
        {onColumnEditClick && <Edit onClick={onColumnEditClick} />}
      </div>
      <div className={tw('overflow-hidden h-full')} ref={ref}>
        <div>
          <SimpleBarReact style={{ maxHeight: height }}>
            <div className={tw('flex flex-col gap-y-2 pr-3')}>
              {taskTemplates.map((taskTemplateExtension, index) => (
                <TaskTemplateCard
                  key={taskTemplateExtension.taskTemplate.id}
                  name={taskTemplateExtension.taskTemplate.name}
                  subtaskCount={taskTemplateExtension.taskTemplate.subtasks.length}
                  isSelected={selectedID === taskTemplateExtension.taskTemplate.id}
                  onTileClick={() => onTileClick(taskTemplateExtension.taskTemplate)}
                  className={tx('border-2 border-gray-300 !pr-2', { 'mb-2': index === taskTemplates.length - 1 })}
                  typeForLabel={taskTemplateExtension.type}
                />
              ))}
            </div>
          </SimpleBarReact>
        </div>
      </div>
    </div>
  )
}
