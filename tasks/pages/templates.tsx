import { tw } from '@helpwave/common/twind'
import { createContext, useState } from 'react'
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
  useDeleteMutation,
  usePersonalTaskTemplateQuery,
  useUpdateMutation
} from '../mutations/task_template_mutations'
import { TaskTemplateDetails } from '../components/layout/TaskTemplateDetails'
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'

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
  template: TaskTemplateDTO,
  wardId?: string,
  deletedSubtaskIds?: string[]
}

export type TaskTemplateContextState = {
  isValid: boolean,
  template: TaskTemplateDTO,
  hasChanges: boolean,
  wardId?: string,
  deletedSubtaskIds?: string[]
}

export const emptyTaskTemplate: TaskTemplateDTO = {
  id: '',
  isPublicVisible: false,
  name: '',
  notes: '',
  subtasks: []
}

export type TaskTemplateContextType = {
  state: TaskTemplateFormType,
  updateContext: (context: TaskTemplateContextState) => void
}

export const taskTemplateContextState = {
  isValid: false,
  template: emptyTaskTemplate,
  hasChanges: false,
  deletedSubtaskIds: []
}

export const TaskTemplateContext = createContext<TaskTemplateContextType>({
  state: taskTemplateContextState,
  updateContext: () => undefined
})

const PersonalTaskTemplatesPage: NextPage = ({ language }: PropsWithLanguage<PersonalTaskTemplateTranslation>) => {
  const translation = useTranslation(language, defaultPersonalTaskTemplateTranslations)
  const router = useRouter()
  const { templateID } = router.query
  const [usedQueryParam, setUsedQueryParam] = useState(false)
  const { user } = useAuth()
  const { isLoading, isError, data } = usePersonalTaskTemplateQuery(user?.id)

  const [contextState, setContextState] = useState<TaskTemplateContextState>(taskTemplateContextState)

  const createMutation = useCreateMutation('personalTaskTemplates', taskTemplate =>
    setContextState({
      ...contextState,
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    }))

  const updateMutation = useUpdateMutation('personalTaskTemplates', taskTemplate => {
    setContextState({
      ...contextState,
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    })
  })

  const deleteMutation = useDeleteMutation('personalTaskTemplates', taskTemplate =>
    setContextState({
      ...contextState,
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    }))

  if (!contextState.hasChanges && templateID && !usedQueryParam) {
    const newSelected = data?.find(value => value.id === templateID) ?? emptyTaskTemplate
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
      crumbs={[{ display: translation.taskTemplates, link: '/templates' }]}
    >
      <Head>
        <title>{titleWrapper(translation.personalTaskTemplates)}</title>
      </Head>
      <TaskTemplateContext.Provider value={{ state: contextState, updateContext: setContextState }}>
        <LoadingAndErrorComponent isLoading={isLoading} hasError={isError || !data} loadingProps={{ classname: tw('!h-full') }} errorProps={{ classname: tw('!h-full') }}>
          <TwoColumn
            disableResize={false}
            left={width => (
              // TODO move this data checking and so on into the TaskTemplateDisplay Component
              data && (
                <TaskTemplateDisplay
                  width={width}
                  onSelectChange={taskTemplate => {
                    setContextState({
                      ...contextState,
                      template: taskTemplate ?? emptyTaskTemplate,
                      hasChanges: false,
                      isValid: taskTemplate !== undefined,
                      deletedSubtaskIds: []
                    })
                  }}
                  selectedID={contextState.template.id}
                  taskTemplates={data}
                  variant="personalTemplates"
                />
              )
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
        </LoadingAndErrorComponent>
      </TaskTemplateContext.Provider>
    </PageWithHeader>
  )
}

export default PersonalTaskTemplatesPage
