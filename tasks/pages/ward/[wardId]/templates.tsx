import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { useWardQuery } from '@helpwave/api-services/mutations/tasks/ward_mutations'
import {
  useCreateMutation,
  useDeleteMutation,
  useUpdateMutation,
  useWardTaskTemplateQuery
} from '@helpwave/api-services/mutations/tasks/task_template_mutations'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import { emptyTaskTemplate, TaskTemplateContext, taskTemplateContextState, type TaskTemplateContextState } from '@/pages/templates'
import { TwoColumn } from '@/components/layout/TwoColumn'
import { PageWithHeader } from '@/components/layout/PageWithHeader'
import titleWrapper from '@/utils/titleWrapper'
import { TaskTemplateDisplay } from '@/components/layout/TaskTemplateDisplay'
import { TaskTemplateDetails } from '@/components/layout/TaskTemplateDetails'
import { useRouteParameters } from '@/hooks/useRouteParameters'

type WardTaskTemplateTranslation = {
  taskTemplates: string,
  organization: string,
  ward: string,
  wardTaskTemplates: string,
}

const defaultWardTaskTemplateTranslations = {
  en: {
    taskTemplates: 'Task Templates',
    organization: 'Organizations',
    ward: 'Ward',
    wardTaskTemplates: 'Ward Task Templates'
  },
  de: {
    taskTemplates: 'Vorlagen',
    organization: 'Organisationen',
    ward: 'Station',
    wardTaskTemplates: 'Stations Vorlagen'
  }
}

const WardTaskTemplatesPage: NextPage = ({ overwriteTranslation }: PropsForTranslation<WardTaskTemplateTranslation>) => {
  const translation = useTranslation(defaultWardTaskTemplateTranslations, overwriteTranslation)
  const { wardId, templateId } = useRouteParameters<'wardId', 'templateId'>()
  const [usedQueryParam, setUsedQueryParam] = useState(false)
  const { isLoading, isError, data } = useWardTaskTemplateQuery(wardId)
  const { data: ward } = useWardQuery(wardId)
  const { organization } = useAuth()
  const [contextState, setContextState] = useState<TaskTemplateContextState>(taskTemplateContextState)

  const createMutation = useCreateMutation(wardId, 'wardTaskTemplates', taskTemplate =>
    setContextState({
      ...contextState,
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    }))

  const updateMutation = useUpdateMutation('wardTaskTemplates', taskTemplate =>
    setContextState({
      ...contextState,
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    }))

  const deleteMutation = useDeleteMutation('wardTaskTemplates', taskTemplate =>
    setContextState({
      ...contextState,
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    }))

  if (!contextState.hasChanges && templateId && !usedQueryParam) {
    const newSelected = data?.find(value => value.id === templateId) ?? emptyTaskTemplate
    setContextState({
      ...contextState,
      isValid: newSelected.id !== '',
      hasChanges: false,
      template: newSelected
    })
    setUsedQueryParam(true)
  }

  return (
    <PageWithHeader
      crumbs={[
        { display: organization?.name ?? translation.organization, link: `/organizations?organizationId=${organization?.id}` },
        { display: ward?.name ?? translation.ward, link: `/organizations/${organization?.id}?wardId=${wardId}` },
        { display: translation.taskTemplates, link: `/ward/${wardId}/templates` }
      ]}
    >
      <Head>
        <title>{titleWrapper(translation.wardTaskTemplates)}</title>
      </Head>
      <TaskTemplateContext.Provider value={{ state: contextState, updateContext: setContextState }}>
        <TwoColumn
          disableResize={false}
          left={() => (
            <LoadingAndErrorComponent
              isLoading={isLoading}
              hasError={isError}
            >
              {data && (
                <TaskTemplateDisplay
                  onSelectChange={taskTemplate => {
                    setContextState({
                      ...contextState,
                      template: taskTemplate ?? {
                        ...emptyTaskTemplate,
                        wardId
                      },
                      hasChanges: false,
                      isValid: taskTemplate !== undefined,
                      deletedSubtaskIds: []
                    })
                  }}
                  wardId={wardId}
                  selectedId={contextState.template.id}
                  taskTemplates={data}
                  variant="wardTemplates"
                />
              )}
            </LoadingAndErrorComponent>
          )}
          right={() => (
            <TaskTemplateDetails
              key={contextState.template.id}
              onCreate={createMutation.mutate}
              onUpdate={updateMutation.mutate}
              onDelete={deleteMutation.mutate}
            />
          )}
        />
      </TaskTemplateContext.Provider>
    </PageWithHeader>
  )
}

export default WardTaskTemplatesPage
