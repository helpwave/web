import { useEffect, useRef, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { Edit } from 'lucide-react'
import type { TaskTemplateDTO } from '@helpwave/api-services/types/tasks/tasks_templates'
import { TaskTemplateCard } from './cards/TaskTemplateCard'

export type TaskTemplateListColumnTranslation = {
  addNewTaskTemplate: string,
  template: string,
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

export type TaskTemplateDTOExtension = { taskTemplate: TaskTemplateDTO, type: 'personal' | 'ward' }

export type TaskTemplateListColumnProps = {
  templates: TaskTemplateDTOExtension[],
  activeId?: string,
  onTileClick: (taskTemplate: TaskTemplateDTO) => void,
  onColumnEditClick?: () => void,
}

/**
 * A column for showing TaskTemplates either for Ward or Private templates
 */
export const TaskTemplateListColumn = ({
                                         templates,
                                         activeId,
                                         onTileClick,
                                         onColumnEditClick,
                                         overwriteTranslation: maybeLanguage
                                       }: PropsForTranslation<TaskTemplateListColumnTranslation, TaskTemplateListColumnProps>) => {
  const translation = useTranslation([defaultTaskTemplateListColumnTranslation], maybeLanguage)
  const [height, setHeight] = useState<number | undefined>(undefined)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHeight(ref.current?.clientHeight)
  }, [ref.current?.clientHeight])

  return (
    <div className="col overflow-hidden h-full">
      <div className="row overflow-hidden">
        <span className="textstyle-lg mb-4 flex-1">
          {translation('template')}
        </span>
        {onColumnEditClick && <Edit onClick={onColumnEditClick}/>}
      </div>
      <div className="overflow-hidden h-full" ref={ref}>
        <div>
          <Scrollbars autoHeight autoHeightMin={height} autoHide>
            <div className="col gap-y-2">
              {templates.map((taskTemplateExtension) => (
                <TaskTemplateCard
                  key={taskTemplateExtension.taskTemplate.id}
                  name={taskTemplateExtension.taskTemplate.name}
                  subtaskCount={taskTemplateExtension.taskTemplate.subtasks.length}
                  onClick={() => onTileClick(taskTemplateExtension.taskTemplate)}
                  className="min-h-auto"
                  isSelected={activeId === taskTemplateExtension.taskTemplate.id}
                  typeForLabel={taskTemplateExtension.type}
                />
              ))}
            </div>
          </Scrollbars>
        </div>
      </div>
    </div>
  )
}
