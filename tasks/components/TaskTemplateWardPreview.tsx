import { useContext } from 'react'
import { useRouter } from 'next/router'
import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Span } from '@helpwave/common/components/Span'
import { Button } from '@helpwave/common/components/Button'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { useWardTaskTemplateQuery } from '@helpwave/api-services/mutations/tasks/task_template_mutations'
import { TaskTemplateCard } from './cards/TaskTemplateCard'
import { OrganizationOverviewContext } from '@/pages/organizations/[organizationId]'

type TaskTemplateWardPreviewTranslation = {
  showAllTaskTemplates: string,
  taskTemplates: (numberOfTemplates: number) => string,
}

const defaultTaskTemplateWardPreviewTranslation: Record<Languages, TaskTemplateWardPreviewTranslation> = {
  en: {
    showAllTaskTemplates: 'Show all Task Templates',
    taskTemplates: (numberOfTemplates) => `Task Templates (${numberOfTemplates})`
  },
  de: {
    showAllTaskTemplates: 'Alle Vorlagen anzeigen',
    taskTemplates: (numberOfTemplates) => `Vorlagen (${numberOfTemplates})`
  }
}

export type TaskTemplateWardPreviewProps = {
  wardId?: string,
  columns?: number,
}

/**
 * A TaskTemplateWardPreview for showing all TaskTemplate within a ward
 */
export const TaskTemplateWardPreview = ({
  overwriteTranslation,
  wardId,
  columns = 3
}: PropsForTranslation<TaskTemplateWardPreviewTranslation, TaskTemplateWardPreviewProps>) => {
  const translation = useTranslation(defaultTaskTemplateWardPreviewTranslation, overwriteTranslation)
  const router = useRouter()

  const context = useContext(OrganizationOverviewContext)

  const { data, isLoading, isError } = useWardTaskTemplateQuery(wardId)

  wardId ??= context.state.wardId
  const taskTemplates = data

  return (
    <LoadingAndErrorComponent
      isLoading={isLoading || !context.state.wardId}
      hasError={isError}
      loadingProps={{ classname: tw('border-2 border-gray-500 rounded-xl min-h-[200px]') }}
      errorProps={{ classname: tw('border-2 border-gray-500 rounded-xl min-h-[200px]') }}
    >
      {taskTemplates && (
        <div className={tw('flex flex-col')}>
          <div className={tw('flex flex-row justify-between items-center mb-4')}>
            <Span type="tableName">{translation.taskTemplates(taskTemplates.length)}</Span>
            <Button
              className={tw('w-auto')}
              onClick={() => router.push(`/ward/${wardId}/templates`)}
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
                onTileClick={() => {
                  router.push(`/ward/${wardId}/templates?templateId=${taskTemplate.id}`).catch(console.error)
                }}
              />
            ))}
          </div>
        </div>
      )}
    </LoadingAndErrorComponent>
  )
}
