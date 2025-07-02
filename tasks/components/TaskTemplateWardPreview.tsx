import { useContext } from 'react'
import { useRouter } from 'next/router'
import type { Translation } from '@helpwave/hightide'
import { LoadingAndErrorComponent, type PropsForTranslation, SolidButton, useTranslation } from '@helpwave/hightide'
import { useWardTaskTemplateQuery } from '@helpwave/api-services/mutations/tasks/task_template_mutations'
import { TaskTemplateCard } from './cards/TaskTemplateCard'
import { OrganizationOverviewContext } from '@/pages/organizations/[organizationId]'

type TaskTemplateWardPreviewTranslation = {
  showAllTaskTemplates: string,
  taskTemplatesCount: string,
}

const defaultTaskTemplateWardPreviewTranslation: Translation<TaskTemplateWardPreviewTranslation> = {
  en: {
    showAllTaskTemplates: 'Show all Task Templates',
    taskTemplatesCount: `Task Templates ({{amount}})`
  },
  de: {
    showAllTaskTemplates: 'Alle Vorlagen anzeigen',
    taskTemplatesCount: `Vorlagen ({{amount}})`
  }
}

export type TaskTemplateWardPreviewProps = {
  wardId?: string,
}

/**
 * A TaskTemplateWardPreview for showing all TaskTemplate within a ward
 */
export const TaskTemplateWardPreview = ({
                                          overwriteTranslation,
                                          wardId,
                                        }: PropsForTranslation<TaskTemplateWardPreviewTranslation, TaskTemplateWardPreviewProps>) => {
  const translation = useTranslation([defaultTaskTemplateWardPreviewTranslation], overwriteTranslation)
  const router = useRouter()

  const context = useContext(OrganizationOverviewContext)

  const { data, isLoading, isError } = useWardTaskTemplateQuery(wardId)

  wardId ??= context.state.wardId
  const taskTemplates = data

  return (
    <LoadingAndErrorComponent
      isLoading={isLoading || !context.state.wardId}
      hasError={isError}
      loadingProps={{ classname: 'border-2 border-gray-500 rounded-xl min-h-[200px]' }}
      errorProps={{ classname: 'border-2 border-gray-500 rounded-xl min-h-[200px]' }}
    >
      {taskTemplates && (
        <div className="@container col">
          <div className="row justify-between items-center mb-4">
            <span className="textstyle-table-name">
              {translation('taskTemplatesCount', { replacements: { amount: taskTemplates.length.toString() } })}
            </span>
            <SolidButton
              className="w-auto"
              onClick={() => router.push(`/ward/${wardId}/templates`)}
            >
              {translation('showAllTaskTemplates')}
            </SolidButton>
          </div>
          <div className="grid @max-md:grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 gap-4">
            {taskTemplates.map((taskTemplate, index) => (
              <TaskTemplateCard
                key={index}
                name={taskTemplate.name}
                subtaskCount={taskTemplate.subtasks.length}
                className="min-h-auto"
                onClick={() => {
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
