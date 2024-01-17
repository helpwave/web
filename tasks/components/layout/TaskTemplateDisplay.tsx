import { useRouter } from 'next/router'
import { tw } from '@helpwave/common/twind'
import { LucideArrowLeftRight } from 'lucide-react'
import { useTranslation, type PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { Button } from '@helpwave/common/components/Button'
import { Span } from '@helpwave/common/components/Span'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { AddCard } from '../cards/AddCard'
import { TaskTemplateCard } from '../cards/TaskTemplateCard'
import type { TaskTemplateDTO } from '@/mutations/task_template_mutations'

export type TaskTemplateDisplayTranslation = {
  addNewTaskTemplate: string,
  personalTaskTemplates: string,
  wardTaskTemplates: string
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
  width?: number
}

/**
 * A column for showing TaskTemplates either for Ward or Private templates
 */
export const TaskTemplateDisplay = ({
  language,
  wardId,
  selectedId,
  onSelectChange,
  taskTemplates,
  variant,
  width
}: PropsWithLanguage<TaskTemplateDisplayTranslation, TaskTemplateDisplayProps>) => {
  const translation = useTranslation(language, defaultTaskTemplateDisplayTranslation)

  const router = useRouter()
  const columns = width === undefined ? 3 : Math.max(1, Math.floor(width / 180))

  const switchToPersonalLink = wardId ? `/templates?wardId=${wardId}` : '/templates'
  return (
    <div className={tw('py-4 px-6')}>
      <div className={tw('flex flex-row items-center justify-between mb-4')}>
        <Span type="subsectionTitle">
          {variant === 'personalTemplates' ? translation.personalTaskTemplates : translation.wardTaskTemplates}
        </Span>
        { (variant === 'wardTemplates' || wardId) && (
          <Button
            onClick={() => {
              router.push(variant === 'personalTemplates' ? `/ward/${wardId}/templates` : switchToPersonalLink).then()
            }}
            className={tw('flex flex-row gap-x-1 items-center w-auto')}
          >
            <LucideArrowLeftRight/>
            {variant === 'personalTemplates' ? translation.wardTaskTemplates : translation.personalTaskTemplates}
          </Button>
        )}
      </div>
      {/* TODO replace onClick function to something different */}
      <div className={tw(`grid grid-cols-${columns} gap-6`)}>
        {taskTemplates.map(taskTemplate => (
          <TaskTemplateCard
            key={taskTemplate.id}
            name={taskTemplate.name}
            subtaskCount={taskTemplate.subtasks.length}
            isSelected={selectedId === taskTemplate.id}
            onEditClick={() => onSelectChange(taskTemplate)}
            onTileClick={() => onSelectChange(taskTemplate)}
          />
        ))}
        <AddCard
          isSelected={selectedId === ''}
          onTileClick={() => onSelectChange(undefined)}
          text={translation.addNewTaskTemplate}
        />
      </div>
    </div>
  )
}
