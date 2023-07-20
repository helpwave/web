import { createContext, useContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '../components/layout/TwoColumn'
import { PageWithHeader } from '../components/layout/PageWithHeader'
import titleWrapper from '../utils/titleWrapper'
import { TaskTemplateDisplay } from '../components/layout/TaskTemplateDisplay'
import type { TaskTemplateDTO } from '../mutations/task_template_mutations'
import {
  useCreateMutation,
  useDeleteMutation, usePersonalTaskTemplateQuery,
  useUpdateMutation
} from '../mutations/task_template_mutations'
import { TaskTemplateDetails } from '../components/layout/TaskTemplateDetails'
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'

type PersonalTaskTemplateTranslation = {
  taskTemplates: string,
  personalTaskTemplates: string
}

const defaultPersonalTaskTemplateTranslations = {
  en: {
    taskTemplates: 'Task Templates',
    personalTaskTemplates: 'Personal Task Templates'
  },
  de: {
    taskTemplates: 'Task Vorlagen',
    personalTaskTemplates: 'Persönliche Task Templates'
  }
}

export type TaskTemplateFormType = {
  isValid: boolean,
  hasChanges: boolean,
  template: TaskTemplateDTO
}

type PersonalTaskTemplateOverviewContextState = {
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

export type PersonalTaskTemplateContextType = {
  state: TaskTemplateFormType,
  updateContext: (context: PersonalTaskTemplateOverviewContextState) => void
}

const emptyPersonalTaskTemplateContextState = {
  isValid: false,
  template: emptyTaskTemplate,
  hasChanges: false
}

const PersonalTaskTemplateContext = createContext<PersonalTaskTemplateContextType>({
  state: emptyPersonalTaskTemplateContextState,
  updateContext: () => undefined
})

const PersonalTaskTemplatesPage: NextPage = ({ language }: PropsWithLanguage<PersonalTaskTemplateTranslation>) => {
  const translation = useTranslation(language, defaultPersonalTaskTemplateTranslations)
  const router = useRouter()
  const { templateID } = router.query
  const [usedQueryParam, setUsedQueryParam] = useState(false)
  const { user } = useAuth()
  const { isLoading, isError, data } = usePersonalTaskTemplateQuery(user?.id)

  const context = useContext(PersonalTaskTemplateContext)
  const [contextState, setContextState] = useState<PersonalTaskTemplateOverviewContextState>(emptyPersonalTaskTemplateContextState)

  const createMutation = useCreateMutation('personalTaskTemplates', taskTemplate =>
    context.updateContext({
      ...context.state,
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    }))
  const updateMutation = useUpdateMutation('personalTaskTemplates', taskTemplate =>
    context.updateContext({
      ...context.state,
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    }))
  const deleteMutation = useDeleteMutation('personalTaskTemplates', taskTemplate =>
    context.updateContext({
      ...context.state,
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    }))

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
      crumbs={[{ display: translation.taskTemplates, link: '/templates' }]}
    >
      <Head>
        <title>{titleWrapper(translation.personalTaskTemplates)}</title>
      </Head>
      <PersonalTaskTemplateContext.Provider value={{ state: contextState, updateContext: setContextState }}>
        <TwoColumn
          disableResize={false}
          left={width => (
            <TaskTemplateDisplay
              width={width}
              onSelectChange={taskTemplate => {
                context.updateContext({
                  template: taskTemplate ?? emptyTaskTemplate,
                  hasChanges: false,
                  isValid: taskTemplate !== undefined,
                })
              }}
              selectedID={contextState.template.id}
              taskTemplates={data}
              variant="personalTemplates"
            />
          )}
          right={width => (
            <TaskTemplateDetails
              context={context}
              width={width}
              key={contextState.template.id}
              onCreate={createMutation.mutate}
              onUpdate={updateMutation.mutate}
              onDelete={deleteMutation.mutate}
            />
          )}
        />
      </PersonalTaskTemplateContext.Provider>
    </PageWithHeader>
  )
}

export default PersonalTaskTemplatesPage
