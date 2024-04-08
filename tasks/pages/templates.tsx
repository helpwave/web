import { createContext, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { tw } from '@helpwave/common/twind'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { TwoColumn } from '@/components/layout/TwoColumn'
import { PageWithHeader } from '@/components/layout/PageWithHeader'
import { TaskTemplateDisplay } from '@/components/layout/TaskTemplateDisplay'
import { TaskTemplateDetails } from '@/components/layout/TaskTemplateDetails'
import titleWrapper from '@/utils/titleWrapper'
import type { TaskTemplate } from '@/mutations/task_template_mutations'
import {
  useCreateMutation,
  useDeleteMutation,
  usePersonalTaskTemplateQuery,
  useUpdateMutation
} from '@/mutations/task_template_mutations'
import { useAuth } from '@/hooks/useAuth'
import { useRouteParameters } from '@/hooks/useRouteParameters'

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
    taskTemplates: 'Vorlagen',
    personalTaskTemplates: 'Persönliche Vorlagen'
  }
}

export type TaskTemplateFormType = {
  isValid: boolean,
  hasChanges: boolean,
  template: TaskTemplate,
  wardId?: string,
  deletedSubtaskIds?: string[]
}

export type TaskTemplateContextState = {
  isValid: boolean,
  template: TaskTemplate,
  hasChanges: boolean,
  wardId?: string,
  deletedSubtaskIds?: string[]
}

export const emptyTaskTemplate: TaskTemplate = {
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

const PersonalTaskTemplatesPage: NextPage = ({ overwriteTranslation }: PropsForTranslation<PersonalTaskTemplateTranslation>) => {
  const translation = useTranslation(defaultPersonalTaskTemplateTranslations, overwriteTranslation)
  const templateId = useRouteParameters<never, 'templateId'>().templateId
  const [usedQueryParam, setUsedQueryParam] = useState(false)
  const { user } = useAuth()
  const { isLoading, isError, data } = usePersonalTaskTemplateQuery(user?.id)

  const [contextState, setContextState] = useState<TaskTemplateContextState>(taskTemplateContextState)

  const wardId = '' // TODO: why is this empty? (tracing back where is value originally came from lead me to the fact that this value would always be undefined or an empty string, thus I hardcoded it here now but it would be great to know if this is correct)
  const createMutation = useCreateMutation(wardId, 'personalTaskTemplates', taskTemplate =>
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
                  wardId={wardId}
                  selectedId={contextState.template.id}
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
