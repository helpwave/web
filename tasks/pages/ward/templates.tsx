import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '../../components/layout/TwoColumn'
import { PageWithHeader } from '../../components/layout/PageWithHeader'
import titleWrapper from '../../utils/titleWrapper'
import type { TaskTemplateDTO } from '../../mutations/room_mutations'
import { useQuery } from '@tanstack/react-query'

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
    wardTaskTemplates: 'Stations Task Vorlagen'
  }
}

export type WardTaskTemplateFormType = {
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

  const [taskTemplateForm, setTaskTemplateForm] = useState<WardTaskTemplateFormType>({
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
        <title>{titleWrapper(translation.wardTaskTemplates)}</title>
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

export default WardTaskTemplatesPage
