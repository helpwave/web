import { useContext } from 'react'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { SolidButton } from '@helpwave/common/components/Button'
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
      loadingProps={{ classname: clsx('border-2 border-gray-500 rounded-xl min-h-[200px]') }}
      errorProps={{ classname: clsx('border-2 border-gray-500 rounded-xl min-h-[200px]') }}
    >
      {taskTemplates && (
        <div className={clsx('col')}>
          <div className={clsx('row justify-between items-center mb-4')}>
            <span className={clsx('textstyle-table-name')}>{translation.taskTemplates(taskTemplates.length)}</span>
            <SolidButton
              className={clsx('w-auto')}
              onClick={() => router.push(`/ward/${wardId}/templates`)}
            >
              {translation.showAllTaskTemplates}
            </SolidButton>
          </div>
          <div className={clsx(`grid grid-cols-${columns} gap-4`)}>
            {taskTemplates.map((taskTemplate, index) => (
              <TaskTemplateCard
                key={index}
                name={taskTemplate.name}
                subtaskCount={taskTemplate.subtasks.length}
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
