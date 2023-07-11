import { useState } from 'react'
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
import type { TaskTemplateFormType } from './ward/[uuid]/templates'
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

const emptyTaskTemplate: TaskTemplateDTO = {
  id: '',
  isPublicVisible: false,
  name: '',
  notes: '',
  subtasks: []
}

const PersonalTaskTemplatesPage: NextPage = ({ language }: PropsWithLanguage<PersonalTaskTemplateTranslation>) => {
  const translation = useTranslation(language, defaultPersonalTaskTemplateTranslations)
  const router = useRouter()
  const { templateID } = router.query
  const [usedQueryParam, setUsedQueryParam] = useState(false)
  const { user } = useAuth()
  const [taskTemplateForm, setTaskTemplateForm] = useState<TaskTemplateFormType>({
    isValid: false,
    hasChanges: false,
    template: emptyTaskTemplate
  })
  const { isLoading, isError, data } = usePersonalTaskTemplateQuery(user?.id)

  const createMutation = useCreateMutation('personalTaskTemplates', taskTemplate =>
    setTaskTemplateForm({
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    }))
  const updateMutation = useUpdateMutation('personalTaskTemplates', taskTemplate =>
    setTaskTemplateForm({
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    }))
  const deleteMutation = useDeleteMutation('personalTaskTemplates', taskTemplate =>
    setTaskTemplateForm({
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    }))

  if (!taskTemplateForm.hasChanges && templateID && !usedQueryParam) {
    const newSelected = data?.find(value => value.id === templateID) ?? emptyTaskTemplate
    setTaskTemplateForm({
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
      <TwoColumn
        disableResize={false}
        left={width => (
          <TaskTemplateDisplay
            width={width}
            onSelectChange={taskTemplate => setTaskTemplateForm({
              template: taskTemplate ?? emptyTaskTemplate,
              hasChanges: false,
              isValid: taskTemplate !== undefined,
            })}
            selectedID={taskTemplateForm.template.id}
            taskTemplates={data}
            variant="personalTemplates"
          />
        )}
        right={width => (
          <TaskTemplateDetails
            width={width}
            key={taskTemplateForm.template.id}
            taskTemplateForm={taskTemplateForm}
            onCreate={createMutation.mutate}
            onUpdate={updateMutation.mutate}
            onDelete={deleteMutation.mutate}
            setTaskTemplateForm={setTaskTemplateForm}
          />
        )}
      />
    </PageWithHeader>
  )
}

export default PersonalTaskTemplatesPage
