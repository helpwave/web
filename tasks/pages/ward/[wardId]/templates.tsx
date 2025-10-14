import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { useWardQuery } from '@helpwave/api-services/mutations/tasks/ward_mutations'
import {
  useWardTaskTemplateQuery
} from '@helpwave/api-services/mutations/tasks/task_template_mutations'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import {
  emptyTaskTemplate,
  TaskTemplateContext,
  taskTemplateContextState,
  type TaskTemplateContextState
} from '@/pages/templates'
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
  const translation = useTranslation([defaultWardTaskTemplateTranslations], overwriteTranslation)
  const { wardId, templateId } = useRouteParameters<'wardId', 'templateId'>()

  const { data: ward } = useWardQuery(wardId)
  const { organization } = useAuth()

  const [usedQueryParam, setUsedQueryParam] = useState(false)
  const { isLoading, isError, data } = useWardTaskTemplateQuery(wardId)
  const [contextState, setContextState] = useState<TaskTemplateContextState>(taskTemplateContextState)

  useEffect(() => {
    setContextState(prevState => {
      const newState = { ...prevState, hasError: isError, isLoading, hasChanges: false, isValid: true }
      if (data) {
        newState.templates = data
        const template = data.find(value => value.id === prevState.template.id)
        if (template) {
          newState.template = template
        }
      }
      return newState
    })
  }, [isLoading, isError, data])

  useEffect(() => {
    setContextState(prevState => ({
      ...prevState,
      wardId,
    }))
  }, [wardId])

  useEffect(() => {
    if (!contextState.hasChanges && templateId && !usedQueryParam) {
      const newSelected = data?.find(value => value.id === templateId) ?? emptyTaskTemplate
      setContextState({
        ...contextState,
        isValid: newSelected.id !== '',
        hasChanges: false,
        template: newSelected,
        wardId: newSelected.wardId
      })
      setUsedQueryParam(true)
    }
  }, [contextState, data, templateId, usedQueryParam])

  return (
    <PageWithHeader
      crumbs={[
        {
          display: organization?.name ?? translation('organization'),
          link: `/organizations?organizationId=${organization?.id}`
        },
        { display: ward?.name ?? translation('ward'), link: `/organizations/${organization?.id}?wardId=${wardId}` },
        { display: translation('taskTemplates'), link: `/ward/${wardId}/templates` }
      ]}
    >
      <Head>
        <title>{titleWrapper(translation('wardTaskTemplates'))}</title>
      </Head>
      <TaskTemplateContext.Provider value={{ state: contextState, updateContext: setContextState }}>
        <TwoColumn
          disableResize={false}
          left={() => (<TaskTemplateDisplay/>)}
          right={() => (<TaskTemplateDetails/>)}
        />
      </TaskTemplateContext.Provider>
    </PageWithHeader>
  )
}

export default WardTaskTemplatesPage
