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
import { useTaskTemplateQuery } from '../mutations/task_template_mutations'
import type { TaskTemplateFormType } from './ward/templates'

type PersonalTaskTemplateTranslation = {
  taskTemplates: string,
  organization: string,
  ward: string,
  personalTaskTemplates: string
}

const defaultPersonalTaskTemplateTranslations = {
  en: {
    taskTemplates: 'Task Templates',
    organization: 'Organizations',
    ward: 'Ward',
    personalTaskTemplates: 'Personal Task Templates'
  },
  de: {
    taskTemplates: 'Task Vorlagen',
    organization: 'Organisationen',
    ward: 'Station',
    personalTaskTemplates: 'Persönliche Task Vorlagen'
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
  const [taskTemplateForm, setTaskTemplateForm] = useState<TaskTemplateFormType>({
    isValid: false,
    hasChanges: false,
    template: emptyTaskTemplate
  })

  const { isLoading, isError, data } = useTaskTemplateQuery()

  // TODO add view for loading
  if (isLoading) {
    return <div>Loading Widget</div>
  }

  // TODO add view for error or error handling
  if (isError) {
    return <div>Error Message</div>
  }

  return (
    <PageWithHeader
      crumbs={[{ display: translation.organization, link: '/organizations' },
        { display: translation.ward, link: '/organizations' },
        { display: translation.taskTemplates, link: '/organizations' }]}
    >
      <Head>
        <title>{titleWrapper(translation.personalTaskTemplates)}</title>
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
            variant="personalTemplates"
          />
        )}
        right={() => (
          <div/>
        )}
      />
    </PageWithHeader>
  )
}

export default PersonalTaskTemplatesPage
