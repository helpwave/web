import type { Customer } from '@/api/dataclasses/customer'
import type { Translation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import clsx from 'clsx'
import { Input } from '@helpwave/common/components/user-input/Input'
import { SolidButton } from '@helpwave/common/components/Button'

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
  houseNumberAdditional: string,
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
    houseNumberAdditional: 'Addition',
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
    houseNumberAdditional: 'Zusatz',
    postalCode: 'Postleitzahl',
    city: 'Stadt',
    country: 'Land',
    save: 'Speichern'
  }
}

type ContactInformationFormProps = {
  value: Customer,
  onChange: (customer: Customer) => void,
  onSubmit: (customer: Customer) => void,
  className?: string,
}

export const ContactInformationForm = ({ value, onChange, onSubmit, className }: ContactInformationFormProps) => {
  const translation = useTranslation(defaultContactInformationTranslation)
  return (
    <form className={clsx('flex flex-col gap-y-1 max-w-[700px]', className)}>
      <h3 className={clsx('font-space font-bold text-2xl')}>{translation.contactInfo}</h3>
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
      <Input
        value={value.phoneNumber ?? ''}
        onChange={phoneNumber => onChange({ ...value, phoneNumber })}
        label={{ name: translation.phone }}
      />
      <div className={clsx('flex flex-col gap-y-1')}>
        <h4 className={clsx('font-space font-bold text-lg')}>{translation.address}</h4>
        <Input
          value={value.address.country ?? ''}
          onChange={country => onChange({ ...value, address: { ...value.address, country } })}
          label={{ name: translation.country }}
        />
        <div className={clsx('flex flex-row gap-x-1')}>
          <Input
            value={value.address.city ?? ''}
            onChange={city => onChange({ ...value, address: { ...value.address, city } })}
            label={{ name: translation.city }}
          />
          <Input
            value={value.address.postalCode ?? ''}
            onChange={postalCode => onChange({
              ...value,
              address: { ...value.address, postalCode }
            })}
            label={{ name: translation.postalCode }}
            containerClassName={clsx('max-w-[180px]')}
          />
        </div>
        <div className={clsx('flex flex-row gap-x-1')}>
          <Input
            value={value.address.street ?? ''}
            onChange={street => onChange({
              ...value,
              address: { ...value.address, street }
            })}
            label={{ name: translation.street }}
          />
          <Input
            value={value.address.houseNumber ?? ''}
            onChange={houseNumber => onChange({
              ...value,
              address: { ...value.address, houseNumber }
            })}
            label={{ name: translation.houseNumber }}
            containerClassName={clsx('max-w-[180px]')}
          />
          <Input
            value={value.address.houseNumberAdditional ?? ''}
            onChange={houseNumberAdditional => onChange({
              ...value,
              address: { ...value.address, houseNumberAdditional }
            })}
            label={{ name: translation.houseNumberAdditional }}
            containerClassName={clsx('max-w-[180px]')}
          />
        </div>
        <div className={clsx('flex flex-col gap-y-1')}>
          <h4 className={clsx('font-space font-bold text-lg')}>{translation.additionalInformation}</h4>
          <Input
            value={value.websiteURL ?? ''}
            onChange={websiteURL => onChange({ ...value, websiteURL })}
            label={{ name: translation.websiteUrl }}
          />
        </div>
      </div>

      <div className={clsx('flex flex-row justify-end')}>
        <SolidButton onClick={() => onSubmit(value)}>{translation.save}</SolidButton>
      </div>
    </form>
  )
}
