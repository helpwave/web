import { useRouter } from 'next/router'

import { LucideArrowLeftRight } from 'lucide-react'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { SolidButton } from '@helpwave/common/components/Button'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { TaskTemplateDTO } from '@helpwave/api-services/types/tasks/tasks_templates'
import { AddCard } from '../cards/AddCard'
import { TaskTemplateCard } from '../cards/TaskTemplateCard'

export type TaskTemplateDisplayTranslation = {
  addNewTaskTemplate: string,
  personalTaskTemplates: string,
  wardTaskTemplates: string,
}

const defaultTaskTemplateDisplayTranslation: Record<Languages, TaskTemplateDisplayTranslation> = {
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
  //selectedId,
  onSelectChange,
  taskTemplates,
  variant,
}: PropsForTranslation<TaskTemplateDisplayTranslation, TaskTemplateDisplayProps>) => {
  const translation = useTranslation(defaultTaskTemplateDisplayTranslation, overwriteTranslation)

  const router = useRouter()

  const switchToPersonalLink = wardId ? `/templates?wardId=${wardId}` : '/templates'
  return (
    <div className="py-4 px-6">
      <div className="row items-center justify-between mb-4">
        <span className="textstyle-title-normal">
          {variant === 'personalTemplates' ? translation.personalTaskTemplates : translation.wardTaskTemplates}
        </span>
        { (variant === 'wardTemplates' || wardId) && (
          <SolidButton
            onClick={() => {
              router.push(variant === 'personalTemplates' ? `/ward/${wardId}/templates` : switchToPersonalLink).catch(console.error)
            }}
            className="row gap-x-1 items-center w-auto"
          >
            <LucideArrowLeftRight/>
            {variant === 'personalTemplates' ? translation.wardTaskTemplates : translation.personalTaskTemplates}
          </SolidButton>
        )}
      </div>
      {/* TODO replace onClick function to something different */}
      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-6">
        {taskTemplates.map(taskTemplate => (
          <TaskTemplateCard
            key={taskTemplate.id}
            name={taskTemplate.name}
            subtaskCount={taskTemplate.subtasks.length}
            //TODO isSelected={selectedId === taskTemplate.id}
            onEditClick={() => onSelectChange(taskTemplate)}
            onClick={() => onSelectChange(taskTemplate)}
          />
        ))}
        <AddCard
          //TODO isSelected={selectedId === ''}
          onClick={() => onSelectChange(undefined)}
          text={translation.addNewTaskTemplate}
        />
      </div>
    </div>
  )
}
