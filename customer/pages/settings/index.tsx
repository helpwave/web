import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { Section } from '@/components/layout/Section'
import { useCustomerMyselfQuery, useCustomerUpdateMutation } from '@/api/mutations/customer_mutations'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { Input } from '@helpwave/common/components/user-input/Input'
import { useEffect, useState } from 'react'
import type { Customer } from '@/api/dataclasses/customer'
import { tw } from '@twind/core'
import { Button } from '@helpwave/common/components/Button'

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

type SettingsServerSideProps = {
  jsonFeed: unknown,
}

const Settings: NextPage<PropsForTranslation<SettingsTranslation, SettingsServerSideProps>> = ({ overwriteTranslation }) => {
  const translation = useTranslation(defaultSettingsTranslations, overwriteTranslation)
  const [currentData, setcurrentData] = useState<Customer>()
  const { data, isError, isLoading } = useCustomerMyselfQuery()
  const customerUpdate = useCustomerUpdateMutation()

  useEffect(() => {
    setcurrentData(data)
  }, [data])

  // TODO do input validation
  return (
    <Page pageTitle={titleWrapper(translation.settings)} mainContainerClassName={tw('min-h-[auto] pb-6')}>
      <Section titleText={translation.settings}>
        <LoadingAndErrorComponent isLoading={isLoading} hasError={isError} minimumLoadingDuration={200}>
          {!!currentData && (
            <div className={tw('flex flex-col gap-y-1 max-w-[700px]')}>
              <span>{translation.settingsDescription}</span>
              <h3 className={tw('font-space font-bold text-2xl')}>{translation.contactInfo}</h3>
              <Input
                value={currentData.name}
                onChange={name => setcurrentData({ ...currentData, name })}
                label={{ name: translation.name }}
              />
              <Input
                value={currentData.email}
                onChange={email => setcurrentData({ ...currentData, email })}
                label={{ name: translation.email }}
              />
              <Input
                value={currentData.phoneNumber ?? ''}
                onChange={phoneNumber => setcurrentData({ ...currentData, phoneNumber })}
                label={{ name: translation.phone }}
              />
              <div className={tw('flex flex-col gap-y-1')}>
                <h4 className={tw('font-space font-bold text-lg')}>{translation.address}</h4>
                <Input
                  value={currentData.address.country ?? ''}
                  onChange={country => setcurrentData({ ...currentData, address: { ...currentData.address, country } })}
                  label={{ name: translation.country }}
                />
                <div className={tw('flex flex-row gap-x-1')}>
                  <Input
                    value={currentData.address.city ?? ''}
                    onChange={city => setcurrentData({ ...currentData, address: { ...currentData.address, city } })}
                    label={{ name: translation.city }}
                  />
                  <Input
                    value={currentData.address.postalCode ?? ''}
                    onChange={postalCode => setcurrentData({
                      ...currentData,
                      address: { ...currentData.address, postalCode }
                    })}
                    label={{ name: translation.postalCode }}
                    containerClassName={tw('max-w-[180px]')}
                  />
                </div>
                <div className={tw('flex flex-row gap-x-1')}>
                  <Input
                    value={currentData.address.street ?? ''}
                    onChange={street => setcurrentData({
                      ...currentData,
                      address: { ...currentData.address, street }
                    })}
                    label={{ name: translation.street }}
                  />
                  <Input
                    value={currentData.address.houseNumber ?? ''}
                    onChange={houseNumber => setcurrentData({
                      ...currentData,
                      address: { ...currentData.address, houseNumber }
                    })}
                    label={{ name: translation.houseNumber }}
                    containerClassName={tw('max-w-[180px]')}
                  />
                  <Input
                    value={currentData.address.houseNumberAdditional ?? ''}
                    onChange={houseNumberAdditional => setcurrentData({
                      ...currentData,
                      address: { ...currentData.address, houseNumberAdditional }
                    })}
                    label={{ name: translation.houseNumberAdditional }}
                    containerClassName={tw('max-w-[180px]')}
                  />
                </div>
                <div className={tw('flex flex-col gap-y-1')}>
                  <h4 className={tw('font-space font-bold text-lg')}>{translation.additionalInformation}</h4>
                  <Input
                    value={currentData.websiteURL ?? ''}
                    onChange={websiteURL => setcurrentData({ ...currentData, websiteURL })}
                    label={{ name: translation.websiteUrl }}
                  />
                </div>
              </div>

              <div className={tw('flex flex-row justify-end')}>
                <Button onClick={() => customerUpdate.mutate(currentData)}>{translation.save}</Button>
              </div>
            </div>
          )}
        </LoadingAndErrorComponent>
      </Section>
    </Page>
  )
}

export default Settings
