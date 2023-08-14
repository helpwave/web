import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '../../../components/layout/TwoColumn'
import { PageWithHeader } from '../../../components/layout/PageWithHeader'
import titleWrapper from '../../../utils/titleWrapper'
import { TaskTemplateDisplay } from '../../../components/layout/TaskTemplateDisplay'
import {
  useCreateMutation,
  useDeleteMutation,
  useUpdateMutation,
  useWardTaskTemplateQuery
} from '../../../mutations/task_template_mutations'
import { TaskTemplateDetails } from '../../../components/layout/TaskTemplateDetails'
import { useRouter } from 'next/router'
import type { TaskTemplateContextState } from '../../templates'
import { emptyTaskTemplate, TaskTemplateContext, taskTemplateContextState } from '../../templates'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'

type WardTaskTemplateTranslation = {
  taskTemplates: string,
  organization: string,
  ward: string,
  wardTaskTemplates: string
}

const defaultWardTaskTemplateTranslations = {
  en: {
    taskTemplates: 'Task Templates',
    organization: 'Organizations',
    ward: 'Ward',
    wardTaskTemplates: 'Ward Task Templates'
  },
  de: {
    taskTemplates: 'Task Vorlagen',
    organization: 'Organisationen',
    ward: 'Station',
    wardTaskTemplates: 'Stations Task Templates'
  }
}

const WardTaskTemplatesPage: NextPage = ({ language }: PropsWithLanguage<WardTaskTemplateTranslation>) => {
  const translation = useTranslation(language, defaultWardTaskTemplateTranslations)
  const router = useRouter()
  const { id: wardId, templateId } = router.query
  const [usedQueryParam, setUsedQueryParam] = useState(false)
  const { isLoading, isError, data } = useWardTaskTemplateQuery(wardId?.toString())

  const [contextState, setContextState] = useState<TaskTemplateContextState>(taskTemplateContextState)

  const createMutation = useCreateMutation('wardTaskTemplates', taskTemplate =>
    setContextState({
      ...contextState,
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    })
  )

  const updateMutation = useUpdateMutation('wardTaskTemplates', taskTemplate =>
    setContextState({
      ...contextState,
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    })
  )

  const deleteMutation = useDeleteMutation('wardTaskTemplates', taskTemplate =>
    setContextState({
      ...contextState,
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    })
  )

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

  // TODO load organization id of ward
  const organizationId = 'org1'

  // TODO update breadcrumbs
  return (
    <PageWithHeader
      crumbs={[
        { display: translation.organization, link: `/organizations?organizationId=${organizationId}` },
        { display: translation.ward, link: `/organizations/${organizationId}?wardId=${wardId}` },
        { display: translation.taskTemplates, link: `/ward/${wardId}/templates` }
      ]}
    >
      <Head>
        <title>{titleWrapper(translation.wardTaskTemplates)}</title>
      </Head>
      <TaskTemplateContext.Provider value={{ state: contextState, updateContext: setContextState }}>
        <TwoColumn
          disableResize={false}
          left={width => (
            <LoadingAndErrorComponent
              isLoading={isLoading}
              hasError={isError}
              minimumLoadingDuration={3000}
            >
              {data && (
                <TaskTemplateDisplay
                  width={width}
                  onSelectChange={taskTemplate => {
                    setContextState({
                      ...contextState,
                      template: taskTemplate ?? {
                        ...emptyTaskTemplate,
                        wardId: wardId as string | undefined
                      },
                      hasChanges: false,
                      isValid: taskTemplate !== undefined,
                      deletedSubtaskIds: []
                    })
                  }}
                  selectedId={contextState.template.id}
                  taskTemplates={data}
                  variant="wardTemplates"
                />
              )}
            </LoadingAndErrorComponent>
          )}
          right={width => (
            <TaskTemplateDetails
              width={width}
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
