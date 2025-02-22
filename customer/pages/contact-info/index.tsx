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

type ContactInfoTranslation = {
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

const defaultContactInfoTranslations: Record<Languages, ContactInfoTranslation> = {
  en: {
    contactInfo: 'Contact Information',
    additionalInformation: 'Additional Information',
    name: 'Name',
    websiteUrl: 'Website URL',
    email: 'Email',
    phone: 'Phonenumber',
    address: 'Address',
    street: 'Street',
    houseNumber: 'Housenumber',
    houseNumberAdditional: 'Housenumber Addition',
    postalCode: 'Postal code',
    city: 'City',
    country: 'Country',
    save: 'Save'
  },
  de: {
    contactInfo: 'Kontakt Informationen',
    additionalInformation: 'Zusätzliche Informationen',
    name: 'Name',
    websiteUrl: 'Website URL',
    email: 'Email',
    phone: 'Telefonnummer',
    address: 'Adresse',
    street: 'Straße',
    houseNumber: 'Hausnummer',
    houseNumberAdditional: 'Hausnummer Zusatz',
    postalCode: 'Postleitzahl',
    city: 'Stadt',
    country: 'Land',
    save: 'Speichern'
  }
}

type ContactInfoServerSideProps = {
  jsonFeed: unknown,
}

const ContactInfo: NextPage<PropsForTranslation<ContactInfoTranslation, ContactInfoServerSideProps>> = ({ overwriteTranslation }) => {
  const translation = useTranslation(defaultContactInfoTranslations, overwriteTranslation)
  const [currentData, setcurrentData] = useState<Customer>()
  const { data, isError, isLoading } = useCustomerMyselfQuery()
  const customerUpdate = useCustomerUpdateMutation()

  useEffect(() => {
    setcurrentData(data)
  }, [data])

  // TODO do input validation
  return (
    <Page pageTitle={titleWrapper(translation.contactInfo)} mainContainerClassName={tw('min-h-[auto] pb-6')}>
      <Section titleText={translation.contactInfo}>
        <LoadingAndErrorComponent isLoading={isLoading} hasError={isError} minimumLoadingDuration={200}>
          {!!currentData && (
            <div className={tw('flex flex-col gap-y-4 max-w-[700px]')}>
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
              <div className={tw('flex flex-col gap-y-4')}>
                <h3 className={tw('font-space font-bold text-lg')}>{translation.address}</h3>
                <Input
                  value={currentData.address.country ?? ''}
                  onChange={country => setcurrentData({ ...currentData, address: { ...currentData.address, country } })}
                  label={{ name: translation.country }}
                />
                <div className={tw('flex flex-row gap-x-2')}>
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
                <div className={tw('flex flex-row gap-x-2')}>
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
                <div className={tw('flex flex-col gap-y-4')}>
                  <h3 className={tw('font-space font-bold text-lg')}>{translation.additionalInformation}</h3>
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

export default ContactInfo
