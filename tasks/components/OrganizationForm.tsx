import clsx from 'clsx'
import type { Translation } from '@helpwave/hightide'
import {
  Input,
  LoadingAndErrorComponent,
  type PropsForTranslation,
  useTranslation,
  validateEmail
} from '@helpwave/hightide'
import type { OrganizationMinimalDTO } from '@helpwave/api-services/types/users/organizations'
import { emptyOrganization } from '@helpwave/api-services/types/users/organizations'

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
  invalidEmail: string,
}

const defaultOrganizationFormTranslations: Translation<OrganizationFormTranslation> = {
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
export type OrganizationFormTouchedType = {
  shortName: boolean,
  longName: boolean,
  email: boolean,
}

export type OrganizationFormType = {
  isValid: boolean,
  hasChanges: boolean,
  organization: OrganizationMinimalDTO,
  touched: OrganizationFormTouchedType,
}

export const emptyOrganizationForm: OrganizationFormType = {
  isValid: false,
  hasChanges: false,
  organization: emptyOrganization,
  touched: {
    shortName: false,
    longName: false,
    email: false
  }
}

// TODO make sure the Organization type only has the used values shortName, longName, email, isVerified
export type OrganizationFormProps = {
  organizationForm: OrganizationFormType,
  onChange: (organizationForm: OrganizationFormType, shouldUpdate: boolean) => void,
}

/**
 * The form to change information about an organization.
 *
 * The state is manged by the parent
 */
export const OrganizationForm = ({
                                   overwriteTranslation,
                                   organizationForm = emptyOrganizationForm,
                                   onChange = () => undefined,
                                 }: PropsForTranslation<OrganizationFormTranslation, OrganizationFormProps>) => {
  const translation = useTranslation(defaultOrganizationFormTranslations, overwriteTranslation)

  const minShortNameLength = 2
  const minLongNameLength = 4
  const maxShortNameLength = 16
  const maxLongNameLength = 64
  const maxMailLength = 320

  const inputErrorClasses = 'border-negative focus:border-negative focus:ring-negative border-2'
  const inputClasses = 'mt-1 block rounded-md w-full border-gray-300 shadow-sm focus:outline-none focus:border-primary focus:ring-primary'

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

  function triggerOnChange(newOrganization: OrganizationMinimalDTO, shouldUpdate: boolean, touched: OrganizationFormTouchedType) {
    const isValid = validateShortName(newOrganization) === undefined && validateLongName(newOrganization) === undefined && validateEmailWithOrganization(newOrganization) === undefined
    onChange({ hasChanges: true, isValid, organization: newOrganization, touched }, shouldUpdate && isValid) // this might lead to confusing behaviour where changes aren't saved on invalid input
  }

  const shortNameErrorMessage: string | undefined = validateShortName(organizationForm.organization)
  const longNameErrorMessage: string | undefined = validateLongName(organizationForm.organization)
  const emailErrorMessage: string | undefined = validateEmailWithOrganization(organizationForm.organization)

  const isDisplayingShortNameError = shortNameErrorMessage && organizationForm.touched.shortName
  const isDisplayingLongNameError = longNameErrorMessage && organizationForm.touched.longName
  const isDisplayingEmailNameError = emailErrorMessage && organizationForm.touched.email

  return (
    <LoadingAndErrorComponent
      isLoading={!organizationForm}
      loadingProps={{ classname: 'border-2 border-gray-500 rounded-xl min-h-[350px]' }}
      minimumLoadingDuration={200} // prevents errors flickering
    >
      <div className="col gap-y-4">
        <span className="textstyle-title-normal">{translation.general}</span>
        <div className="col gap-y-1">
          <Input
            id="shortName"
            value={organizationForm.organization.shortName}
            label={{ name: translation.shortName }}
            onBlur={() => triggerOnChange({ ...organizationForm.organization }, false, {
              ...organizationForm.touched,
              shortName: true
            })}
            onChangeText={text => triggerOnChange({
              ...organizationForm.organization,
              shortName: text
            }, false, { ...organizationForm.touched })}
            onEditCompleted={text => triggerOnChange({
              ...organizationForm.organization,
              shortName: text
            }, true, { ...organizationForm.touched, shortName: true })}
            maxLength={maxShortNameLength}
            className={clsx(inputClasses, { [inputErrorClasses]: isDisplayingShortNameError })}
          />
          {isDisplayingShortNameError && <span className="textstyle-form-error">{shortNameErrorMessage}</span>}
          <span className="textstyle-form-description">{translation.shortNameDescription}</span>
        </div>
        <div className="col gap-y-1">
          <Input
            id="longName"
            value={organizationForm.organization.longName}
            label={{ name: translation.longName }}
            onBlur={() => triggerOnChange({ ...organizationForm.organization }, false, {
              ...organizationForm.touched,
              longName: true
            })}
            onChangeText={text => triggerOnChange({
              ...organizationForm.organization,
              longName: text
            }, false, { ...organizationForm.touched })}
            onEditCompleted={text => triggerOnChange({
              ...organizationForm.organization,
              longName: text
            }, true, { ...organizationForm.touched, longName: true })}
            maxLength={maxLongNameLength}
            className={clsx(inputClasses, { [inputErrorClasses]: isDisplayingLongNameError })}
          />
          {isDisplayingLongNameError && <span className="textstyle-form-error">{longNameErrorMessage}</span>}
          <span className="textstyle-form-description">{translation.longNameDescription}</span>
        </div>
        <div className="col gap-y-1">
          <div className="row items-end">
            <div className="flex-1 mr-2">
              <Input
                id="email"
                value={organizationForm.organization.email}
                label={{ name: translation.contactEmail }}
                type="email"
                onBlur={() => triggerOnChange({ ...organizationForm.organization }, false, {
                  ...organizationForm.touched,
                  email: true
                })}
                onChangeText={text => triggerOnChange({
                  ...organizationForm.organization,
                  email: text
                }, false, { ...organizationForm.touched })}
                onEditCompleted={text => triggerOnChange({
                  ...organizationForm.organization,
                  email: text
                }, true, { ...organizationForm.touched, email: true })}
                maxLength={maxMailLength}
                className={clsx(inputClasses, { [inputErrorClasses]: isDisplayingEmailNameError })}
              />
            </div>
            {
              !organizationForm.organization.isVerified &&
              <span className="text-negative mb-3">{translation.notVerified}</span>
            }
          </div>
          {isDisplayingEmailNameError && <span className="textstyle-form-error">{emailErrorMessage}</span>}
          <span className="textstyle-form-description">{translation.contactEmailDescription}</span>
        </div>
      </div>
    </LoadingAndErrorComponent>
  )
}
