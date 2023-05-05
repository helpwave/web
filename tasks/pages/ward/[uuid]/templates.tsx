import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '../../../components/layout/TwoColumn'
import { PageWithHeader } from '../../../components/layout/PageWithHeader'
import titleWrapper from '../../../utils/titleWrapper'
import { TaskTemplateDisplay } from '../../../components/layout/TaskTemplateDisplay'
import type { TaskTemplateDTO } from '../../../mutations/task_template_mutations'
import {
  useCreateMutation,
  useDeleteMutation,
  useTaskTemplateQuery,
  useUpdateMutation
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

const emptyTaskTemplate: TaskTemplateDTO = {
  id: '',
  isPublicVisible: false,
  name: '',
  notes: '',
  subtasks: []
}

const WardTaskTemplatesPage: NextPage = ({ language }: PropsWithLanguage<WardTaskTemplateTranslation>) => {
  const translation = useTranslation(language, defaultWardTaskTemplateTranslations)
  const router = useRouter()
  const { uuid, templateID } = router.query

  const { isLoading, isError, data } = useTaskTemplateQuery()

  const [taskTemplateForm, setTaskTemplateForm] = useState<TaskTemplateFormType>({
    isValid: false,
    hasChanges: false,
    template: data?.find(value => value.id === templateID) ?? emptyTaskTemplate
  })

  const createMutation = useCreateMutation(taskTemplate =>
    setTaskTemplateForm({
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    }))
  const updateMutation = useUpdateMutation(taskTemplate =>
    setTaskTemplateForm({
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    }))
  const deleteMutation = useDeleteMutation(taskTemplate =>
    setTaskTemplateForm({
      hasChanges: false,
      isValid: taskTemplate !== undefined,
      template: taskTemplate ?? emptyTaskTemplate
    }))

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
      crumbs={[{ display: translation.organization, link: `/organizations/${organizationID}` },
        { display: translation.ward, link: `/ward/${uuid}` },
        { display: translation.taskTemplates, link: `/ward/${uuid}/templates` }]}
    >
      <Head>
        <title>{titleWrapper(translation.wardTaskTemplates)}</title>
      </Head>
      <TwoColumn
        left={() => (
          <TaskTemplateDisplay
            onSelectChange={taskTemplate => setTaskTemplateForm({
              template: taskTemplate ?? emptyTaskTemplate,
              hasChanges: false,
              isValid: taskTemplate !== undefined,
            })}
            selectedID={taskTemplateForm.template.id}
            taskTemplates={data}
            variant="wardTemplates"
          />
        )}
        right={() => (
          <TaskTemplateDetails
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

export default WardTaskTemplatesPage
