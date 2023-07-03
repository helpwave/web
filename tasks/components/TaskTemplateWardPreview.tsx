import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Span } from '@helpwave/common/components/Span'
import { Button } from '@helpwave/common/components/Button'
import { useRouter } from 'next/router'
import { TaskTemplateCard } from './cards/TaskTemplateCard'
import type { TaskTemplateWardPreviewDTO } from '../mutations/task_template_mutations'

type TaskTemplateWardPreviewTranslation = {
  showAllTaskTemplates: string,
  taskTemplates: (numberOfTemplates: number) => string
}

const defaultTaskTemplateWardPreviewTranslation: Record<Languages, TaskTemplateWardPreviewTranslation> = {
  en: {
    showAllTaskTemplates: 'Show all Task Templates',
    taskTemplates: (numberOfTemplates) => `Task Templates (${numberOfTemplates})`
  },
  de: {
    showAllTaskTemplates: 'Alle Task Templates anzeigen',
    taskTemplates: (numberOfTemplates) => `Task Templates (${numberOfTemplates})`
  }
}

export type TaskTemplateWardPreviewProps = {
  wardID: string,
  taskTemplates: TaskTemplateWardPreviewDTO[],
  columns?: number
}

/**
 * A TaskTemplateWardPreview for showing all TaskTemplate within a ward
 */
export const TaskTemplateWardPreview = ({
  language,
  wardID,
  taskTemplates,
  columns = 3
}: PropsWithLanguage<TaskTemplateWardPreviewTranslation, TaskTemplateWardPreviewProps>) => {
  const translation = useTranslation(language, defaultTaskTemplateWardPreviewTranslation)
  const router = useRouter()

  return (
    <div className={tw('flex flex-col')}>
      <div className={tw('flex flex-row justify-between items-center mb-4')}>
        <Span type="tableName">{translation.taskTemplates(taskTemplates.length)}</Span>
        <Button
          className={tw('w-auto')}
          onClick={() => router.push(`/ward/${wardID}/templates`)}
        >
          {translation.showAllTaskTemplates}
        </Button>
      </div>
      <div className={tw(`grid grid-cols-${columns} gap-4`)}>
        {taskTemplates.map((taskTemplate, index) => (
          <TaskTemplateCard
            key={index}
            name={taskTemplate.name}
            subtaskCount={taskTemplate.subtasks.length}
            onTileClick={() => { router.push(`/ward/${wardID}/templates?templateID=${taskTemplate.id}`).then() }}
          />
        ))}
      </div>
    </div>
  )
}
