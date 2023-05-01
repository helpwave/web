import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '../components/layout/TwoColumn'
import { PageWithHeader } from '../components/layout/PageWithHeader'
import titleWrapper from '../utils/titleWrapper'
import type { TaskTemplateDTO } from '../mutations/room_mutations'
import { useQuery } from '@tanstack/react-query'

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

export type PersonalTaskTemplateFormType = {
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

const PersonalTaskTemplatesPage: NextPage = ({ language }: PropsWithLanguage<PersonalTaskTemplateTranslation>) => {
  const translation = useTranslation(language, defaultPersonalTaskTemplateTranslations)

  const [taskTemplateForm, setTaskTemplateForm] = useState<PersonalTaskTemplateFormType>({
    isValid: false,
    hasChanges: false,
    template: emptyTaskTemplate
  })

  const { isLoading, isError, data } = useQuery([''])

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
          <div/>
        )}
        right={() => (
          <div/>
        )}
      />
    </PageWithHeader>
  )
}

export default PersonalTaskTemplatesPage
