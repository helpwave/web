import { useEffect, useRef, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { tw, tx } from '@helpwave/common/twind'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Span } from '@helpwave/common/components/Span'
import { Edit } from 'lucide-react'
import { TaskTemplateCard } from './cards/TaskTemplateCard'
import type { TaskTemplate } from '@/mutations/task_template_mutations'

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

export type TaskTemplateDTOExtension = {taskTemplate: TaskTemplate, type: 'personal' | 'ward'}

export type TaskTemplateListColumnProps = {
  templates: TaskTemplateDTOExtension[],
  activeId: string | undefined,
  onTileClick: (taskTemplate: TaskTemplate) => void,
  onColumnEditClick?: () => void
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
  const translation = useTranslation(defaultTaskTemplateListColumnTranslation, maybeLanguage)
  const [height, setHeight] = useState<number | undefined>(undefined)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHeight(ref.current?.clientHeight)
  }, [ref.current?.clientHeight])

  return (
    <div className={tw('flex flex-col overflow-hidden h-full')}>
      <div className={tw('flex flex-row overflow-hidden')}>
        <Span className={tw('text-2xl font-space font-bold mb-4 flex-1')}>
          {translation.template}
        </Span>
        {onColumnEditClick && <Edit onClick={onColumnEditClick} />}
      </div>
      <div className={tw('overflow-hidden h-full')} ref={ref}>
        <div>
          <Scrollbars autoHeight autoHeightMin={height} autoHide >
            <div className={tw('flex flex-col gap-y-2 pr-3')}>
              {templates.map((taskTemplateExtension, index) => (
                <TaskTemplateCard
                  key={taskTemplateExtension.taskTemplate.id}
                  name={taskTemplateExtension.taskTemplate.name}
                  subtaskCount={taskTemplateExtension.taskTemplate.subtasks.length}
                  isSelected={activeId === taskTemplateExtension.taskTemplate.id}
                  onTileClick={() => onTileClick(taskTemplateExtension.taskTemplate)}
                  className={tx('border-2 border-gray-300 !pr-2', { 'mb-2': index === templates.length - 1 })}
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
