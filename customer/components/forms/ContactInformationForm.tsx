import type { CustomerCreate } from '@/api/dataclasses/customer'
import type { Translation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import clsx from 'clsx'
import { SolidButton } from '@helpwave/hightide'
import { FormInput } from '@helpwave/hightide'
import { useForm } from 'react-hook-form'

type ContactInformationTranslation = {
  contactInfo: string,
  additionalInformation: string,
  name: string,
  websiteURL: string,
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

  // Validation messages
  fieldRequired: string,
  fieldRequiredShort: string,
  emailInvalid: string,
  phoneInvalid: string,
  addressRequired: string,
  houseNumberRequired: string,
  houseNumberInvalid: string,
  postalCodeInvalid: string,
  websiteInvalid: string,
}

const defaultContactInformationTranslation: Translation<ContactInformationTranslation> = {
  en: {
    contactInfo: 'Contact Information',
    additionalInformation: 'Additional Information',
    name: 'Name',
    websiteURL: 'Website URL',
    email: 'Email',
    phone: 'Phonenumber',
    address: 'Address',
    street: 'Street',
    houseNumber: 'Housenumber',
    careOf: 'c/o addition',
    postalCode: 'Postal code',
    city: 'City',
    country: 'Country',
    save: 'Save',
    fieldRequired: 'This field is required and cannot be empty',
    fieldRequiredShort: 'required',
    emailInvalid: 'Enter a valid email address',
    phoneInvalid: 'Enter a valid phone number',
    addressRequired: 'Address is required',
    houseNumberRequired: 'House number is required',
    houseNumberInvalid: 'Invalid house number format',
    postalCodeInvalid: 'Invalid postal code',
    websiteInvalid: 'Invalid website URL',
  },
  de: {
    contactInfo: 'Kontakt Informationen',
    additionalInformation: 'Zusätzliche Informationen',
    name: 'Name',
    websiteURL: 'Website URL',
    email: 'Email',
    phone: 'Telefonnummer',
    address: 'Adresse',
    street: 'Straße',
    houseNumber: 'Hausnummer',
    careOf: 'c/o Zusatz',
    postalCode: 'Postleitzahl',
    city: 'Stadt',
    country: 'Land',
    save: 'Speichern',
    fieldRequired: 'Dieses Feld kann nicht leer sein.',
    fieldRequiredShort: 'notwendig',
    emailInvalid: 'Gültige E-Mail-Adresse eingeben',
    phoneInvalid: 'Gültige Telefonnummer eingeben',
    addressRequired: 'Adresse ist erforderlich',
    houseNumberRequired: 'Hausnummer ist erforderlich',
    houseNumberInvalid: 'Ungültiges Hausnummernformat',
    postalCodeInvalid: 'Ungültige Postleitzahl',
    websiteInvalid: 'Ungültige Website-URL',
  },
}

type ContactInformationFormProps = {
  initialValue: CustomerCreate,
  onSubmit: (customer: CustomerCreate) => void,
  className?: string,
}

export const ContactInformationForm = ({ initialValue, onSubmit, className }: ContactInformationFormProps) => {
  const translation = useTranslation(defaultContactInformationTranslation)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerCreate>({ defaultValues: initialValue })

  // TODO show response on error or success

  return (
    <form
      id="organization-form"
      onSubmit={handleSubmit((data, event) => {
        onSubmit(data)
        event?.preventDefault()
      })}
      className={clsx('flex flex-col gap-y-2 max-w-[700px]', className)}
    >
      <h3 className="font-space font-bold text-2xl">{translation.contactInfo}</h3>
      <FormInput
        id="name"
        autoComplete="name"
        required={true}
        {...register('name', { required: translation.fieldRequired })}
        labelText={translation.name}
        errorText={errors.name?.message}
      />

      <FormInput
        id="email"
        autoComplete="email"
        required={true}
        {...register('email', {
          required: translation.fieldRequired,
          pattern: {
            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            message: translation.emailInvalid,
          },
        })}
        labelText={translation.email}
        errorText={errors.email?.message}
      />
      <FormInput
        id="phoneNumber"
        autoComplete="tel"
        {...register('phoneNumber', {
          pattern: {
            value: /^\+?[0-9\s\-()]{7,15}$/,
            message: translation.phoneInvalid,
          },
        })}
        labelText={translation.phone}
        errorText={errors.phoneNumber?.message}
      />
      <h4 className="font-space font-bold text-lg mt-2">{translation.address}</h4>

      <div className="row">
        <FormInput
          id="address"
          autoComplete="street-address"
          required={true}
          {...register('address', { required: translation.fieldRequired })}
          labelText={translation.address}
          errorText={errors.address?.message}
          containerClassName="w-full"
        />
        <FormInput
          id="houseNumber"
          required={true}
          {...register('houseNumber', {
            required: translation.fieldRequiredShort,
            pattern: {
              value: /^[0-9]{1,6}([A-Za-z]|-[0-9]{1,3}|\/[0-9]{1,3})?$/,
              message: translation.houseNumberInvalid,
            },
          })}
          labelText={translation.houseNumber}
          errorText={errors.houseNumber?.message}
          containerClassName="max-w-[180px]"
        />
      </div>

      <FormInput
        id="careOf"
        {...register('careOf')}
        labelText={translation.careOf}
        errorText={errors.careOf?.message}
      />

      <div className="row">
        <FormInput
          id="city"
          autoComplete="address-level1"
          required={true}
          {...register('city', { required: translation.fieldRequired })}
          labelText={translation.city}
          errorText={errors.city?.message}
          containerClassName="w-full"
        />
        <FormInput
          id="postalCode"
          autoComplete="postal-code"
          required={true}
          {...register('postalCode', {
            required: translation.fieldRequiredShort,
            pattern: {
              value: /^[A-Za-z0-9\- ]{3,10}$/,
              message: translation.postalCodeInvalid,
            },
          })}
          labelText={translation.postalCode}
          errorText={errors.postalCode?.message}
          containerClassName="max-w-[180px]"
        />
      </div>

      <FormInput
        id="country"
        autoComplete="country"
        required={true}
        {...register('country', { required: translation.fieldRequired })}
        labelText={translation.country}
        errorText={errors.country?.message}
      />

      <h4 className="font-space font-bold text-lg mt-2">{translation.additionalInformation}</h4>
      <FormInput
        id="websiteURL"
        autoComplete="url"
        {...register('websiteURL', {
          pattern: {
            value: /^https?:\/\/[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+(?::[0-9]+)?(?:\/\S*)?$/,
            message: translation.websiteInvalid,
          },
        })}
        labelText={translation.websiteURL}
        errorText={errors.websiteURL?.message}
      />

      <div className="row justify-end mt-2">
        <SolidButton type="submit">{translation.save}</SolidButton>
      </div>
    </form>
  )
}
