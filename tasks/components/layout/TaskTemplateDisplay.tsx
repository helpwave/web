import { tw } from '@helpwave/common/twind'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { LucideArrowLeftRight } from 'lucide-react'
import { TaskTemplateCard } from '../cards/TaskTemplateCard'
import { Button } from '@helpwave/common/components/Button'
import { AddCard } from '../cards/AddCard'
import { useRouter } from 'next/router'
import type { TaskTemplateDTO } from '../../mutations/task_template_mutations'

export type TaskTemplateDisplayTranslation = {
  addNewTaskTemplate: string,
  switchToPersonal: string,
  switchToWardView: string,
  taskTemplates: string
}

const defaultTaskTemplateDisplayTranslation = {
  en: {
    addNewTaskTemplate: 'Add new template',
    switchToPersonal: 'Personal Task Templates',
    switchToWardView: 'Ward Task Templates',
    taskTemplates: 'Task Templates'
  },
  de: {
    addNewTaskTemplate: 'Neue Vorlage hinzufügen',
    switchToPersonal: 'Persönliche Task Vorlagen',
    switchToWardView: 'Stations Task Vorlagen',
    taskTemplates: 'Task Vorlagen'
  }
}

export type TaskTemplateDisplayProps = {
  selectedID: string,
  onSelectChange: (taskTemplate: TaskTemplateDTO | undefined) => void,
  taskTemplates: TaskTemplateDTO[],
  variant: 'wardTemplates' | 'personalTemplates'
}

/**
 * A column for showing TaskTemplates either for Ward or Private templates
 */
export const TaskTemplateDisplay = ({
  language,
  selectedID,
  onSelectChange,
  taskTemplates,
  variant
}: PropsWithLanguage<TaskTemplateDisplayTranslation, TaskTemplateDisplayProps>) => {
  const translation = useTranslation(language, defaultTaskTemplateDisplayTranslation)
  const router = useRouter()

  return (
    <div className={tw('py-4 px-6')}>
      <div className={tw('flex flex-row items-center justify-between mb-4')}>
        {/* TODO replace with Span title */}
        <span className={tw('font-bold text-xl font-space')}>
          {translation.taskTemplates}
        </span>
        <div>
          <Button
            onClick={() => {
              // TODO maybe replace with something else later
              router.push(variant === 'personalTemplates' ? '/ward/templates' : '/templates').then()
            }}
            className={tw('flex flex-row gap-x-1 items-center')}
          >
            <LucideArrowLeftRight/>
            {variant === 'personalTemplates' ? translation.switchToWardView : translation.switchToPersonal}
          </Button>
        </div>
      </div>
      {/* TODO replace onClick function to something different */}
      <div className={tw('grid grid-cols-4 gap-6')}>
        {taskTemplates.map(taskTemplate => (
            <TaskTemplateCard
              key={taskTemplate.name}
              name={taskTemplate.name}
              subtaskCount={taskTemplate.subtasks.length}
              isSelected={selectedID === taskTemplate.id}
              onEditClick={() => onSelectChange(taskTemplate)}
              onTileClick={() => onSelectChange(taskTemplate)}
            />
        ))}
        <AddCard
          isSelected={selectedID === ''}
          onTileClick={() => onSelectChange(undefined)}
          text={translation.addNewTaskTemplate}
          className={tw('h-auto')}
        />
      </div>
    </div>
  )
}
