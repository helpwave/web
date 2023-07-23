import { useState } from 'react'
import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Input } from '@helpwave/common/components/user_input/Input'
import { Span } from '@helpwave/common/components/Span'
import type { OrganizationMinimalDTO } from '../mutations/organization_mutations'
import { emptyOrganization } from '../mutations/organization_mutations'
import { validateEmail } from '@helpwave/common/util/emailValidation'

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
    contactEmail: 'Kontakt E-Mail',
    contactEmailDescription: 'Sichtbar für Nicht-Mitglieder.',
    notVerified: 'Noch nicht bestätigt!',
    required: 'Benötigter Wert, darf nicht leer sein',
    tooLong: (maxCharacters) => `Zu lang, maximal ${maxCharacters} Zeichen`,
    tooShort: (minCharacters) => `Zu kurz, mindestens ${minCharacters} Zeichen`,
    invalidEmail: 'Ungültige Email Adresse'
  }
}

export type OrganizationFormType = {
  isValid: boolean,
  hasChanges: boolean,
  organization: OrganizationMinimalDTO
}

export const emptyOrganizationForm: OrganizationFormType = {
  isValid: false,
  hasChanges: false,
  organization: emptyOrganization
}

// TODO make sure the Organization type only has the used values shortName, longName, email, isVerified
export type OrganizationFormProps = {
  organizationForm?: OrganizationFormType,
  onChange: (organizationForm: OrganizationFormType, shouldUpdate: boolean) => void,
  isShowingErrorsDirectly?: boolean
}

/**
 * The form to change information about an organization.
 *
 * The state is manged by the parent
 */
export const OrganizationForm = ({
  language,
  organizationForm = emptyOrganizationForm,
  onChange = () => undefined,
  isShowingErrorsDirectly = false
}: PropsWithLanguage<OrganizationFormTranslation, OrganizationFormProps>) => {
  const translation = useTranslation(language, defaultOrganizationFormTranslations)
  const [touched, setTouched] = useState({
    shortName: isShowingErrorsDirectly,
    longName: isShowingErrorsDirectly,
    email: isShowingErrorsDirectly
  })

  const minShortNameLength = 2
  const minLongNameLength = 4
  const maxShortNameLength = 16
  const maxLongNameLength = 64
  const maxMailLength = 320

  const inputErrorClasses = tw('border-hw-negative-500 focus:border-hw-negative-500 focus:ring-hw-negative-500 border-2')
  const inputClasses = tw('mt-1 block rounded-md w-full border-gray-300 shadow-sm focus:outline-none focus:border-hw-primary-500 focus:ring-hw-primary-500')

  function validateShortName(organization: OrganizationMinimalDTO) {
    const shortName = organization.shortName.trim()
    if (shortName === '') {
      return translation.required
    } else if (shortName.length < minShortNameLength) {
      return translation.tooShort(minShortNameLength)
    } else if (shortName.length > maxShortNameLength) {
      return translation.tooLong(maxShortNameLength)
    }
  }

  function validateLongName(organization: OrganizationMinimalDTO) {
    const longName = organization.longName.trim()
    if (longName === '') {
      return translation.required
    } else if (longName.length < minLongNameLength) {
      return translation.tooShort(minLongNameLength)
    } else if (longName.length > maxLongNameLength) {
      return translation.tooLong(maxLongNameLength)
    }
  }

  function validateEmailWithOrganization(organization: OrganizationMinimalDTO) {
    const email = organization.email.trim()
    if (email === '') {
      return translation.required
    } else if (!validateEmail(organization.email)) {
      return translation.invalidEmail
    }
  }

  function triggerOnChange(newOrganization: OrganizationMinimalDTO, shouldUpdate: boolean) {
    const isValid = validateShortName(newOrganization) === undefined && validateLongName(newOrganization) === undefined && validateEmailWithOrganization(newOrganization) === undefined
    onChange({ hasChanges: true, isValid, organization: newOrganization }, shouldUpdate && isValid) // this might lead to confusing behaviour where changes aren't saved on invalid input
  }

  if (!organizationForm) {
    // TODO replace with loading animation
    return <div>Loading OrganizationForm</div>
  }

  const shortNameErrorMessage: string | undefined = validateShortName(organizationForm.organization)
  const longNameErrorMessage: string | undefined = validateLongName(organizationForm.organization)
  const emailErrorMessage: string | undefined = validateEmailWithOrganization(organizationForm.organization)

  const isDisplayingShortNameError = shortNameErrorMessage && touched.shortName
  const isDisplayingLongNameError = longNameErrorMessage && touched.longName
  const isDisplayingEmailNameError = emailErrorMessage && touched.email

  return (
    <form>
      <Span type="subsectionTitle">{translation.general}</Span>
      <div className={tw('mt-2 mb-1')}>
        <Input
          id="shortName"
          value={organizationForm.organization.shortName}
          label={translation.shortName}
          onBlur={() => setTouched({ ...touched, shortName: true })}
          onChange={text => triggerOnChange({ ...organizationForm.organization, shortName: text }, false)}
          onEditCompleted={text => triggerOnChange({ ...organizationForm.organization, shortName: text }, true)}
          maxLength={maxShortNameLength}
          className={tx(inputClasses, { [inputErrorClasses]: isDisplayingShortNameError })}
        />
        {isDisplayingShortNameError && <Span type="formError">{shortNameErrorMessage}</Span>}
      </div>
      <Span type="formDescription">{translation.shortNameDescription}</Span>
      <div className={tw('mt-2 mb-1')}>
        <Input
          id="longName"
          value={organizationForm.organization.longName}
          label={translation.longName}
          onBlur={() => setTouched({ ...touched, longName: true })}
          onChange={text => triggerOnChange({ ...organizationForm.organization, longName: text }, false)}
          onEditCompleted={text => triggerOnChange({ ...organizationForm.organization, longName: text }, true)}
          maxLength={maxLongNameLength}
          className={tx(inputClasses, { [inputErrorClasses]: isDisplayingLongNameError })}
        />
        {isDisplayingLongNameError && <Span type="formError">{longNameErrorMessage}</Span>}
      </div>
      <Span type="formDescription">{translation.longNameDescription}</Span>
      <div className={tw('mt-2 mb-1')}>
        <div className={tw('flex flex-row items-end')}>
          <div className={tw('flex-1 mr-2')}>
            <Input
              id="email"
              value={organizationForm.organization.email}
              label={translation.contactEmail} type="email"
              onBlur={() => setTouched({ ...touched, email: true })}
              onChange={text => triggerOnChange({ ...organizationForm.organization, email: text }, false)}
              onEditCompleted={text => triggerOnChange({ ...organizationForm.organization, email: text }, true)}
              maxLength={maxMailLength}
              className={tx(inputClasses, { [inputErrorClasses]: isDisplayingEmailNameError })}
            />
          </div>
          {
            !organizationForm.organization.isVerified &&
            <Span className={tw('text-hw-negative-500 mb-3')}>{translation.notVerified}</Span>
          }
        </div>
        {isDisplayingEmailNameError && <Span type="formError">{emailErrorMessage}</Span>}
      </div>
      <Span type="formDescription">{translation.contactEmailDescription}</Span>
    </form>
  )
}
