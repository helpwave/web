import { useRouter } from 'next/router'
import { LucideArrowLeftRight } from 'lucide-react'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { SolidButton } from '@helpwave/hightide'
import type { Translation } from '@helpwave/hightide'
import type { TaskTemplateDTO } from '@helpwave/api-services/types/tasks/tasks_templates'
import { AddCard } from '../cards/AddCard'
import { TaskTemplateCard } from '../cards/TaskTemplateCard'
import clsx from 'clsx'
import { ColumnTitle } from '@/components/ColumnTitle'

export type TaskTemplateDisplayTranslation = {
  addNewTaskTemplate: string,
  personalTaskTemplates: string,
  wardTaskTemplates: string,
}

const defaultTaskTemplateDisplayTranslation: Translation<TaskTemplateDisplayTranslation> = {
  en: {
    addNewTaskTemplate: 'Add new template',
    personalTaskTemplates: 'Personal Task Templates',
    wardTaskTemplates: 'Ward Task Templates'
  },
  de: {
    addNewTaskTemplate: 'Neues Vorlagen hinzufügen',
    personalTaskTemplates: 'Meine Vorlagen',
    wardTaskTemplates: 'Stations Vorlagen'
  }
}

export type TaskTemplateDisplayProps = {
  wardId: string,
  selectedId: string,
  onSelectChange: (taskTemplate: TaskTemplateDTO | undefined) => void,
  taskTemplates: TaskTemplateDTO[],
  variant: 'wardTemplates' | 'personalTemplates',
}

/**
 * A column for showing TaskTemplates either for Ward or Private templates
 */
export const TaskTemplateDisplay = ({
  overwriteTranslation,
  wardId,
  selectedId,
  onSelectChange,
  taskTemplates,
  variant,
}: PropsForTranslation<TaskTemplateDisplayTranslation, TaskTemplateDisplayProps>) => {
  const translation = useTranslation([defaultTaskTemplateDisplayTranslation], overwriteTranslation)

  const router = useRouter()

  const switchToPersonalLink = wardId ? `/templates?wardId=${wardId}` : '/templates'
  return (
    <div className="py-4 px-6 @container">
      <ColumnTitle
        title={variant === 'personalTemplates' ? translation('personalTaskTemplates') : translation('wardTaskTemplates')}
        actions={(variant === 'wardTemplates' || wardId) && (
          <SolidButton
            onClick={() => {
              router.push(variant === 'personalTemplates' ? `/ward/${wardId}/templates` : switchToPersonalLink).catch(console.error)
            }}
            className="row gap-x-1 items-center w-auto"
          >
            <LucideArrowLeftRight/>
            {variant === 'personalTemplates' ? translation('wardTaskTemplates') : translation('personalTaskTemplates')}
          </SolidButton>
        )}
      />
      <div className="grid @max-md:grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 gap-6">
        {taskTemplates.map(taskTemplate => (
          <TaskTemplateCard
            key={taskTemplate.id}
            name={taskTemplate.name}
            subtaskCount={taskTemplate.subtasks.length}
            isSelected={selectedId === taskTemplate.id}
            onEditClick={() => onSelectChange(taskTemplate)}
            onClick={() => onSelectChange(taskTemplate)}
            className="min-h-auto"
          />
        ))}
        <AddCard
          onClick={() => onSelectChange(undefined)}
          className={clsx({
            'border-primary border-2': selectedId === ''
          })}
          text={translation('addNewTaskTemplate')}
        />
      </div>
    </div>
  )
}
