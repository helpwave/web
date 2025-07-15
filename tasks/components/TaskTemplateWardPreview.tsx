import { useContext } from 'react'
import { useRouter } from 'next/router'
import type { Translation } from '@helpwave/hightide'
import { LoadingAndErrorComponent, type PropsForTranslation, SolidButton, useTranslation } from '@helpwave/hightide'
import { useWardTaskTemplateQuery } from '@helpwave/api-services/mutations/tasks/task_template_mutations'
import { TaskTemplateCard } from './cards/TaskTemplateCard'
import { OrganizationOverviewContext } from '@/pages/organizations/[organizationId]'
import { ColumnTitle } from '@/components/ColumnTitle'
import { AddCard } from '@/components/cards/AddCard'

type TaskTemplateWardPreviewTranslation = {
  showAllTaskTemplates: string,
  taskTemplatesCount: string,
  addTaskTemplate: string,
}

const defaultTaskTemplateWardPreviewTranslation: Translation<TaskTemplateWardPreviewTranslation> = {
  en: {
    showAllTaskTemplates: 'Show all Task Templates',
    taskTemplatesCount: `Task Templates ({{amount}})`,
    addTaskTemplate: 'Add Task Template'
  },
  de: {
    showAllTaskTemplates: 'Alle Vorlagen anzeigen',
    taskTemplatesCount: `Vorlagen ({{amount}})`,
    addTaskTemplate: 'Neues Task Template'
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
      className="min-h-27"
      minimumLoadingDuration={200}
    >
      {taskTemplates && (
        <div className="@container flex-col-2">
          <ColumnTitle
            title={translation('taskTemplatesCount', { replacements: { amount: taskTemplates.length.toString() } })}
            actions={(
              <SolidButton
                size="small"
                onClick={() => router.push(`/ward/${wardId}/templates`)}
              >
                {translation('showAllTaskTemplates')}
              </SolidButton>
            )}
            type="subtitle"
          />
          <div className="grid @max-md:grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 gap-4">
            {taskTemplates.map((taskTemplate, index) => (
              <TaskTemplateCard
                key={index}
                name={taskTemplate.name}
                subtaskCount={taskTemplate.subtasks.length}
                className="!min-h-17"
                onClick={() => {
                  router.push(`/ward/${wardId}/templates?templateId=${taskTemplate.id}`).catch(console.error)
                }}
              />
            ))}
            <AddCard
              text={translation('addTaskTemplate')}
              className="!min-h-17"
              onClick={() => router.push(`/ward/${wardId}/templates`).catch(console.error)}
            />
          </div>
        </div>
      )}
    </LoadingAndErrorComponent>
  )
}
