import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { tw } from '@twind/core'
import { useState } from 'react'
import type { Customer } from '@/api/dataclasses/customer'
import { Section } from '@/components/layout/Section'
import { ContactInformationForm } from '@/components/forms/ContactInformationForm'

type CreateOrganizationTranslation = {
  createOrganization: string,
  createOrganizationDescription: string,
}

const defaultCreateOrganizationTranslations: Record<Languages, CreateOrganizationTranslation> = {
  en: {
    createOrganization: 'Create Organization',
    createOrganizationDescription: 'You must create a Organization to use our Service.'
  },
  de: {
    createOrganization: 'Create Organization',
    createOrganizationDescription: 'Du musst eine Organisation erstellen um unseren Service nutzen zu können',
  }
}

type CreateOrganizationPageProps = {
  createOrganization: (organization: Customer) => Promise<boolean>,
}

export const CreateOrganizationPage = ({ createOrganization, overwriteTranslation }: PropsForTranslation<CreateOrganizationTranslation, CreateOrganizationPageProps>) => {
  const translation = useTranslation(defaultCreateOrganizationTranslations, overwriteTranslation)
  const [data, setData] = useState<Customer>({
    uuid: '',
    name: '',
    email: '',
    address: {
      country: '',
      city: '',
      postalCode: '',
      street: '',
      houseNumber: '',
      houseNumberAdditional: ''
    },
    creationDate: new Date(),
    websiteURL: '',
    phoneNumber: '',
  })

  return (
    <Page
      pageTitle={titleWrapper(translation.createOrganization)}
      mainContainerClassName={tw('min-h-[90vh] max-w-[700px]')}
      contentAndFooterClassName={tw('items-center')}
      isHidingSidebar={true}
    >
      <Section>
        <h2 className={tw('font-space text-3xl font-bold')}>{translation.createOrganization}</h2>
        <span className={tw('text-gray-500')}>{translation.createOrganizationDescription}</span>
        <ContactInformationForm
          value={data}
          onChange={setData}
          onSubmit={() => {createOrganization(data).catch(console.error)}}
        />
      </Section>
    </Page>
  )
}
