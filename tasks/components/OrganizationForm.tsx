import { tw, tx } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Input } from './Input'
import { useState } from 'react'

type OrganizationFormTranslation = {
  general: string,
  saveChanges: string,
  shortName: string,
  shortNameDescription: string,
  longName: string,
  longNameDescription: string,
  contactEmail: string,
  contactEmailDescription: string,
  notVerified: string,
  required: string,
  tooLong: (maxCharacters: number) => string,
  tooShort: (minCharacters: number) => string,
  invalidEmail: string
}

const defaultOrganizationFormTranslations: Record<Languages, OrganizationFormTranslation> = {
  en: {
    general: 'General',
    saveChanges: 'Save changes',
    shortName: 'Short name',
    shortNameDescription: 'Used in most situations, should be short and distinctive.',
    longName: 'Long name',
    longNameDescription: 'Used sparingly if there is enough space to display it.',
    contactEmail: 'Contact email',
    contactEmailDescription: 'Is visible to outside members.',
    notVerified: 'Not verified yet!',
    required: 'Required Field, cannot be empty',
    tooLong: (maxCharacters) => `Too long, at most ${maxCharacters} characters`,
    tooShort: (minCharacters) => `Too short, at least ${minCharacters} characters`,
    invalidEmail: 'Invalid email address'
  },
  de: {
    general: 'Allgemeines',
    saveChanges: 'Speichern',
    shortName: 'Abbkürzung',
    shortNameDescription: 'Häufig verwendet, sollte kurz und beschreibend sein.',
    longName: 'Ausgeschriebener Name',
    longNameDescription: 'Selten verwendet, falls der Platz zur Darstellung reicht.',
    contactEmail: 'Kontkct email',
    contactEmailDescription: 'Sichtbar für Nicht-Mitglieder.',
    notVerified: 'Noch nicht bestätigt!',
    required: 'Benötigter Wert, darf nicht leer sein',
    tooLong: (maxCharacters) => `Zu lang, maximal ${maxCharacters} Zeichen`,
    tooShort: (minCharacters) => `Zu kurz, mindestens ${minCharacters} Zeichen`,
    invalidEmail: 'Ungültige Email Adresse'
  }
}

type OrganizationGeneralInfoDTO = {
  shortName: string,
  longName: string,
  email: string,
  isVerified: boolean
}

// TODO make sure the Organization type only has the used values shortName, longName, email, isVerified
export type OrganizationFormProps = {
  organization?: OrganizationGeneralInfoDTO,
  onChange: (organization: OrganizationGeneralInfoDTO, isValid: boolean) => void,
  isShowingErrorsDirectly?: boolean
}

export const OrganizationForm = ({
  language,
  organization = { shortName: '', longName: '', email: '', isVerified: false },
  onChange = () => undefined,
  isShowingErrorsDirectly = false
}: PropsWithLanguage<OrganizationFormTranslation, OrganizationFormProps>) => {
  const translation = useTranslation(language, defaultOrganizationFormTranslations)
  const [touched, setTouched] = useState({ shortName: isShowingErrorsDirectly, longName: isShowingErrorsDirectly, email: isShowingErrorsDirectly })

  const minShortNameLength = 2
  const minLongNameLength = 4
  const maxShortNameLength = 16
  const maxLongNameLength = 64
  const maxMailLength = 320

  const inputErrorClasses = tw('border-hw-negative-500 focus:border-hw-negative-500 focus:ring-hw-negative-500 border-2')
  const errorClasses = tw('text-hw-negative-500 text-sm')
  const inputClasses = tw('mt-1 block rounded-md w-full border-gray-300 shadow-sm focus:outline-none focus:border-hw-primary-500 focus:ring-hw-primary-500')

  function validateShortName(organization: OrganizationGeneralInfoDTO) {
    if (organization.shortName === '') {
      return translation.required
    } else if (organization.shortName.length < minShortNameLength) {
      return translation.tooShort(minShortNameLength)
    } else if (organization.shortName.length > maxShortNameLength) {
      return translation.tooLong(maxShortNameLength)
    }
  }

  function validateLongName(organization: OrganizationGeneralInfoDTO) {
    if (organization.longName === '') {
      return translation.required
    } else if (organization.longName.length < minLongNameLength) {
      return translation.tooShort(minLongNameLength)
    } else if (organization.longName.length > maxLongNameLength) {
      return translation.tooLong(maxLongNameLength)
    }
  }

  function validateEmail(organization: OrganizationGeneralInfoDTO) {
    if (organization.email === '') {
      return translation.required
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(organization.email)) {
      return translation.invalidEmail
    }
  }

  function triggerOnChange(newOrganization: OrganizationGeneralInfoDTO) {
    const isValid = validateShortName(newOrganization) === undefined && validateLongName(newOrganization) === undefined && validateEmail(newOrganization) === undefined
    onChange(newOrganization, isValid)
  }

  const shortNameErrorMessage: string | undefined = validateShortName(organization)
  const longNameErrorMessage: string | undefined = validateLongName(organization)
  const emailErrorMessage: string | undefined = validateEmail(organization)

  const isDisplayingShortNameError = shortNameErrorMessage && touched.shortName
  const isDisplayingLongNameError = longNameErrorMessage && touched.longName
  const isDisplayingEmailNameError = emailErrorMessage && touched.email

  return (
    <form>
      <span className={tw('font-semibold')}>{translation.general}</span>
      <div className={tw('mt-2 mb-1')}>
        <Input id="shortName" value={organization.shortName} label={translation.shortName}
               onBlur={() => setTouched({ ...touched, shortName: true })}
               onChange={text => triggerOnChange({ ...organization, shortName: text })}
               maxLength={maxShortNameLength}
               className={tx(inputClasses, { [inputErrorClasses]: isDisplayingShortNameError })}
        />
        {isDisplayingShortNameError && <span className={tw(errorClasses)}>{shortNameErrorMessage}</span>}
      </div>
      <span className={tw('text-gray-500 text-sm')}>{translation.shortNameDescription}</span>
      <div className={tw('mt-2 mb-1')}>
        <Input id="longName" value={organization.longName} label={translation.longName}
               onBlur={() => setTouched({ ...touched, longName: true })}
               onChange={text => triggerOnChange({ ...organization, longName: text })}
               maxLength={maxLongNameLength}
               className={tx(inputClasses, { [inputErrorClasses]: isDisplayingLongNameError })}
        />
        {isDisplayingLongNameError && <span className={tw(errorClasses)}>{longNameErrorMessage}</span>}
      </div>
      <span className={tw('text-gray-500 text-sm')}>{translation.longNameDescription}</span>
      <div className={tw('mt-2 mb-1')}>
        <div className={tw('flex flex-row items-end')}>
          <div className={tw('flex-1 mr-2')}>
            <Input id="email" value={organization.email} label={translation.contactEmail} type="email"
                   onBlur={() => setTouched({ ...touched, email: true })}
                   onChange={text => triggerOnChange({ ...organization, email: text })}
                   maxLength={maxMailLength}
                   className={tx(inputClasses, { [inputErrorClasses]: isDisplayingEmailNameError })}
            />
          </div>
          {
            !organization.isVerified &&
            <span className={tw('text-hw-negative-500 mb-3')}>{translation.notVerified}</span>
          }
        </div>
        {isDisplayingEmailNameError && <span className={tw(errorClasses)}>{emailErrorMessage}</span>}
      </div>
      <span className={tw('text-gray-500 text-sm')}>{translation.contactEmailDescription}</span>
    </form>
  )
}
