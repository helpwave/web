import type { Dispatch, SetStateAction } from 'react'
import { createContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

import { type PropsForTranslation, useTranslation } from '@helpwave/hightide'
import type { TaskTemplateDTO } from '@helpwave/api-services/types/tasks/tasks_templates'
import {
  usePersonalTaskTemplateQuery
} from '@helpwave/api-services/mutations/tasks/task_template_mutations'
import { TwoColumn } from '@/components/layout/TwoColumn'
import { PageWithHeader } from '@/components/layout/PageWithHeader'
import { TaskTemplateDisplay } from '@/components/layout/TaskTemplateDisplay'
import { TaskTemplateDetails } from '@/components/layout/TaskTemplateDetails'
import titleWrapper from '@/utils/titleWrapper'
import { useRouteParameters } from '@/hooks/useRouteParameters'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'

type PersonalTaskTemplateTranslation = {
  taskTemplates: string,
  personalTaskTemplates: string,
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

export type TaskTemplateContextState = {
  isValid: boolean,
  isLoading: boolean,
  hasError: boolean,
  hasChanges: boolean,
  template: TaskTemplateDTO,
  wardId?: string,
  templates: TaskTemplateDTO[],
  deletedSubtaskIds?: string[],
}

export const emptyTaskTemplate: TaskTemplateDTO = {
  id: '',
  isPublicVisible: false,
  name: '',
  notes: '',
  subtasks: [],
  creatorId: ''
}

export type TaskTemplateContextType = {
  state: TaskTemplateContextState,
  updateContext: Dispatch<SetStateAction<TaskTemplateContextState>>,
}

export const taskTemplateContextState = {
  isValid: false,
  isLoading: true,
  hasError: false,
  hasChanges: false,
  template: emptyTaskTemplate,
  deletedSubtaskIds: [],
  templates: [],
}

export const TaskTemplateContext = createContext<TaskTemplateContextType>({
  state: taskTemplateContextState,
  updateContext: () => undefined
})

const PersonalTaskTemplatesPage: NextPage = ({ overwriteTranslation }: PropsForTranslation<PersonalTaskTemplateTranslation>) => {
  const translation = useTranslation([defaultPersonalTaskTemplateTranslations], overwriteTranslation)
  const templateId = useRouteParameters<never, 'templateId'>().templateId
  const [usedQueryParam, setUsedQueryParam] = useState(false)
  const { user } = useAuth()
  const { isLoading, isError, data } = usePersonalTaskTemplateQuery(user?.id)

  const [contextState, setContextState] = useState<TaskTemplateContextState>(taskTemplateContextState)
  useEffect(() => {
    setContextState(prevState => {
      const newState = { ...prevState, hasError: isError, isLoading, hasChanges: false, isValid: true }
      if (data) {
        newState.templates = data
        newState.template = data.find(value => value.id === prevState.template.id) ?? emptyTaskTemplate
      }
      return newState
    })
  }, [isLoading, isError, data])

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
      crumbs={[{ display: translation('taskTemplates'), link: '/templates' }]}
    >
      <Head>
        <title>{titleWrapper(translation('personalTaskTemplates'))}</title>
      </Head>
      <TaskTemplateContext.Provider value={{ state: contextState, updateContext: setContextState }}>
        <TwoColumn
          disableResize={false}
          left={() => (<TaskTemplateDisplay/>)}
          right={() => (<TaskTemplateDetails key={contextState.template.id}/>)}
        />
      </TaskTemplateContext.Provider>
    </PageWithHeader>
  )
}

export default PersonalTaskTemplatesPage
