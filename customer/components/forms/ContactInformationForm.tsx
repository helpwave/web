import type { CustomerCreate } from '@/api/dataclasses/customer'
import type { Translation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw, tx } from '@twind/core'
import { Input } from '@helpwave/common/components/user-input/Input'
import { Button } from '@helpwave/common/components/Button'

type ContactInformationTranslation = {
  contactInfo: string,
  additionalInformation: string,
  name: string,
  websiteUrl: string,
  email: string,
  phone: string,
  address: string,
  street: string,
  houseNumber: string,
  careOf: string,
  postalCode: string,
  city: string,
  country: string,
  save: string,
}

const defaultContactInformationTranslation: Translation<ContactInformationTranslation> = {
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
    careOf: 'c/o addition',
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
    careOf: 'c/o Zusatz',
    postalCode: 'Postleitzahl',
    city: 'Stadt',
    country: 'Land',
    save: 'Speichern'
  }
}

type ContactInformationFormProps = {
  value: CustomerCreate,
  onChange: (customer: CustomerCreate) => void,
  onSubmit: (customer: CustomerCreate) => void,
  className?: string,
}

export const ContactInformationForm = ({ value, onChange, onSubmit, className }: ContactInformationFormProps) => {
  const translation = useTranslation(defaultContactInformationTranslation)
  return (
    <form
      id="organization-form"
      onSubmit={(event) => {
        onSubmit(value)
        event.preventDefault()
      }}
      className={tx('@(flex flex-col gap-y-1 max-w-[700px])', className)}
    >
      <h3 className={tw('font-space font-bold text-2xl')}>{translation.contactInfo}</h3>
      <Input
        value={value.name}
        onChange={name => onChange({ ...value, name })}
        label={{ name: translation.name }}
      />
      <Input
        value={value.email}
        onChange={email => onChange({ ...value, email })}
        label={{ name: translation.email }}
      />
      {/*
      <Input
        value={value.phoneNumber ?? ''}
        onChange={phoneNumber => onChange({...value, phoneNumber})}
        label={{name: translation.phone}}
      />
      */}
      <div className={tw('flex flex-col gap-y-1')}>
        <h4 className={tw('font-space font-bold text-lg')}>{translation.address}</h4>
        <Input
          value={value.country ?? ''}
          onChange={country => onChange({ ...value, country })}
          label={{ name: translation.country }}
        />
        <div className={tw('flex flex-row gap-x-1')}>
          <Input
            value={value.city ?? ''}
            onChange={city => onChange({ ...value, city })}
            label={{ name: translation.city }}
          />
          <Input
            value={value.postalCode ?? ''}
            onChange={postalCode => onChange({ ...value, postalCode })}
            label={{ name: translation.postalCode }}
            containerClassName={tw('max-w-[180px]')}
          />
        </div>
        <div className={tw('flex flex-row gap-x-1')}>
          <Input
            value={value.address ?? ''}
            onChange={address => onChange({ ...value, address })}
            label={{ name: translation.street }}
          />
          <Input
            value={value.houseNumber?.toString() ?? ''}
            onChange={houseNumber => onChange({ ...value, houseNumber })}
            label={{ name: translation.houseNumber }}
            containerClassName={tw('max-w-[180px]')}
          />
        </div>
        <Input
          value={value.careOf ?? ''}
          onChange={careOf => onChange({ ...value, careOf })}
          label={{ name: translation.careOf }}
        />
        <div className={tw('flex flex-col gap-y-1')}>
          <h4 className={tw('font-space font-bold text-lg')}>{translation.additionalInformation}</h4>
          <Input
            value={value.websiteURL ?? ''}
            onChange={websiteURL => onChange({ ...value, websiteURL })}
            label={{ name: translation.websiteUrl }}
          />
        </div>
      </div>
      <div className={tw('flex flex-row justify-end')}>
        <Button type="submit">{translation.save}</Button>
      </div>
    </form>
  )
}
