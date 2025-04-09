import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { Section } from '@/components/layout/Section'
import { useCustomerMyselfQuery, useCustomerUpdateMutation } from '@/api/mutations/customer_mutations'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { useEffect, useState } from 'react'
import type { Customer } from '@/api/dataclasses/customer'
import clsx from 'clsx'
import { ContactInformationForm } from '@/components/forms/ContactInformationForm'

type SettingsTranslation = {
  settings: string,
  settingsDescription: string,
  contactInfo: string,
  additionalInformation: string,
  name: string,
  websiteUrl: string,
  email: string,
  phone: string,
  address: string,
  street: string,
  houseNumber: string,
  houseNumberAdditional: string,
  postalCode: string,
  city: string,
  country: string,
  save: string,
}

const defaultSettingsTranslations: Record<Languages, SettingsTranslation> = {
  en: {
    settings: 'Settings',
    settingsDescription: 'Here you can change the settings and information of your organization.',
    contactInfo: 'Contact Information',
    additionalInformation: 'Additional Information',
    name: 'Name',
    websiteUrl: 'Website URL',
    email: 'Email',
    phone: 'Phonenumber',
    address: 'Address',
    street: 'Street',
    houseNumber: 'Housenumber',
    houseNumberAdditional: 'Addition',
    postalCode: 'Postal code',
    city: 'City',
    country: 'Country',
    save: 'Save'
  },
  de: {
    settings: 'Einstellungen',
    settingsDescription: 'Hier kannst du die Einstellungen und Informationen deiner Organization ändern.',
    contactInfo: 'Kontakt Informationen',
    additionalInformation: 'Zusätzliche Informationen',
    name: 'Name',
    websiteUrl: 'Website URL',
    email: 'Email',
    phone: 'Telefonnummer',
    address: 'Adresse',
    street: 'Straße',
    houseNumber: 'Hausnummer',
    houseNumberAdditional: 'Zusatz',
    postalCode: 'Postleitzahl',
    city: 'Stadt',
    country: 'Land',
    save: 'Speichern'
  }
}

const Settings: NextPage<PropsForTranslation<SettingsTranslation>> = ({ overwriteTranslation }) => {
  const translation = useTranslation(defaultSettingsTranslations, overwriteTranslation)
  const [currentData, setCurrentData] = useState<Customer>()
  const { data, isError, isLoading } = useCustomerMyselfQuery()
  const customerUpdate = useCustomerUpdateMutation()

  useEffect(() => {
    setCurrentData(data)
  }, [data])

  // TODO do input validation
  return (
    <Page pageTitle={titleWrapper(translation.settings)} mainContainerClassName={clsx('min-h-[auto] pb-6')}>
      <Section titleText={translation.settings}>
        <span>{translation.settingsDescription}</span>
        <LoadingAndErrorComponent isLoading={isLoading} hasError={isError} minimumLoadingDuration={200}>
          {!!currentData && (
            <ContactInformationForm value={currentData} onChange={setCurrentData} onSubmit={customerUpdate.mutate}/>
          )}
        </LoadingAndErrorComponent>
      </Section>
    </Page>
  )
}

export default Settings
