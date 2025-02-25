import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { tw } from '@twind/core'
import { useState } from 'react'
import type { Customer } from '@/api/dataclasses/customer'
import { useCustomerCreateMutation } from '@/api/mutations/customer_mutations'
import { useOrganization } from '@/hooks/useOrganization'
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

const CreateOrganization: NextPage<PropsForTranslation<CreateOrganizationTranslation>> = ({ overwriteTranslation }) => {
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
  const createMutation = useCustomerCreateMutation()
  const { reload } = useOrganization()

  return (
    <Page
      pageTitle={titleWrapper(translation.createOrganization)}
      mainContainerClassName={tw('min-h-[90vh] max-w-[700px]')}
      isHidingSidebar={true}
    >
      <Section>
        <h2 className={tw('font-space text-3xl font-bold')}>{translation.createOrganization}</h2>
        <span className={tw('text-gray-500')}>{translation.createOrganizationDescription}</span>
        <ContactInformationForm
          value={data}
          onChange={setData}
          onSubmit={async () => {
            createMutation.mutate(data)
            // TODO we have to wait here, ensure it this works or try changing the organization context to do that
            reload()
          }}
        />
      </Section>
    </Page>
  )
}

export default CreateOrganization
