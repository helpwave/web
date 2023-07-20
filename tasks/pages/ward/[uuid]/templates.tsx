import { createContext, useContext, useState } from 'react'
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
  useUpdateMutation, useWardTaskTemplateQuery
} from '../../../mutations/task_template_mutations'
import type {
  TaskTemplateDTO
} from '../../../mutations/task_template_mutations'
import { TaskTemplateDetails } from '../../../components/layout/TaskTemplateDetails'
import { useRouter } from 'next/router'

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

export type TaskTemplateFormType = {
  isValid: boolean,
  hasChanges: boolean,
  template: TaskTemplateDTO
}

type WardTaskTemplateOverviewContextState = {
  isValid: boolean,
  template: TaskTemplateDTO,
  hasChanges: boolean
}

const emptyTaskTemplate: TaskTemplateDTO = {
  wardId: '',
  id: '',
  isPublicVisible: false,
  name: '',
  notes: '',
  subtasks: []
}

export type WardTaskTemplateContextType = {
  state: TaskTemplateFormType,
  updateContext: (context: WardTaskTemplateOverviewContextState) => void
}

const emptyWardTaskTemplateContextState = {
  isValid: false,
  template: emptyTaskTemplate,
  hasChanges: false
}

const WardTaskTemplateContext = createContext<WardTaskTemplateContextType>({
  state: emptyWardTaskTemplateContextState,
  updateContext: () => undefined
})
const WardTaskTemplatesPage: NextPage = ({ language }: PropsWithLanguage<WardTaskTemplateTranslation>) => {
  const context = useContext(WardTaskTemplateContext)
  const translation = useTranslation(language, defaultWardTaskTemplateTranslations)
  const router = useRouter()
  const { uuid: warId, templateID } = router.query
  const [usedQueryParam, setUsedQueryParam] = useState(false)
  const { isLoading, isError, data } = useWardTaskTemplateQuery(warId?.toString())

  const [contextState, setContextState] = useState<WardTaskTemplateOverviewContextState>(emptyWardTaskTemplateContextState)

  const createMutation = useCreateMutation('wardTaskTemplates', taskTemplate =>
    context.updateContext({
      ...context.state,
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    })
  )

  const updateMutation = useUpdateMutation('wardTaskTemplates', taskTemplate =>
    context.updateContext({
      ...context.state,
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    })
  )

  const deleteMutation = useDeleteMutation('wardTaskTemplates', taskTemplate =>
    context.updateContext({
      ...context.state,
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    })
  )

  if (!context.state.hasChanges && templateID && !usedQueryParam) {
    const newSelected = data?.find(value => value.id === templateID) ?? emptyTaskTemplate
    context.updateContext({
      ...context.state,
      isValid: newSelected.id !== '',
      hasChanges: false,
      template: newSelected
    })
    setUsedQueryParam(true)
  }

  // TODO load organization id of ward
  const organizationID = 'org1'

  // TODO add view for loading
  if (isLoading) {
    return <div>Loading Widget</div>
  }

  // TODO add view for error or error handling
  if (isError) {
    return <div>Error Message</div>
  }

  // TODO update breadcrumbs
  return (
    <PageWithHeader
      crumbs={[
        { display: translation.organization, link: `/organizations?organizationID=${organizationID}` },
        { display: translation.ward, link: `/organizations/${organizationID}?wardID=${warId}` },
        { display: translation.taskTemplates, link: `/ward/${warId}/templates` }
      ]}
    >
      <Head>
        <title>{titleWrapper(translation.wardTaskTemplates)}</title>
      </Head>
      <WardTaskTemplateContext.Provider value={{ state: contextState, updateContext: setContextState }}>
        <TwoColumn
          disableResize={false}
          left={width => (
            <TaskTemplateDisplay
              width={width}
              onSelectChange={taskTemplate =>
                context.updateContext({
                  ...context.state,
                  template: taskTemplate ?? emptyTaskTemplate,
                  hasChanges: false,
                  isValid: taskTemplate !== undefined,
                })}
              selectedID={context.state.template.id}
              taskTemplates={data}
              variant="wardTemplates"
            />
          )}
          right={width => (
            <TaskTemplateDetails
              context={context}
              width={width}
              key={context.state.template.id}
              onCreate={createMutation.mutate}
              onUpdate={updateMutation.mutate}
              onDelete={deleteMutation.mutate}
            />
          )}
        />
      </WardTaskTemplateContext.Provider>
    </PageWithHeader>
  )
}

export default WardTaskTemplatesPage
