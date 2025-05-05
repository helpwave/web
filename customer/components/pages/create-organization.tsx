import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { clsx } from 'clsx'
import type { CustomerCreate } from '@/api/dataclasses/customer'
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
  createOrganization: (organization: CustomerCreate) => Promise<boolean>,
}

export const CreateOrganizationPage = ({
                                         createOrganization,
                                         overwriteTranslation
                                       }: PropsForTranslation<CreateOrganizationTranslation, CreateOrganizationPageProps>) => {
  const translation = useTranslation(defaultCreateOrganizationTranslations, overwriteTranslation)

  return (
    <Page
      pageTitle={titleWrapper(translation.createOrganization)}
      mainContainerClassName={'max-w-[700px]'}
      contentAndFooterClassName={'items-center'}
      isHidingSidebar={true}
    >
      <Section>
        <h2 className={clsx('font-space text-3xl font-bold')}>{translation.createOrganization}</h2>
        <span className={clsx('text-gray-500')}>{translation.createOrganizationDescription}</span>
        <ContactInformationForm
          initialValue={{
            name: '',
            email: '',
            phoneNumber: '',
            address: '',
            country: '',
            city: '',
            postalCode: '',
            houseNumber: '',
            careOf: '',
            websiteURL: '',
          }}
          onSubmit={(data) => {
            createOrganization(data).catch(console.error)
          }}
        />
      </Section>
    </Page>
  )
}
