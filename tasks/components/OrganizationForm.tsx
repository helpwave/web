import clsx from 'clsx'
import type { Translation } from '@helpwave/hightide'
import {
  FormElementWrapper,
  Input,
  LoadingAndErrorComponent,
  type PropsForTranslation,
  useTranslatedValidators,
  useTranslation
} from '@helpwave/hightide'
import type { OrganizationMinimalDTO } from '@helpwave/api-services/types/users/organizations'
import { emptyOrganization } from '@helpwave/api-services/types/users/organizations'
import { ColumnTitle } from '@/components/ColumnTitle'

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
  tooLong: string,
  tooShort: string,
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
    tooLong: `Too long, at most {{characters}} characters`,
    tooShort: `Too short, at least {{characters}} characters`,
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
    tooLong: `Zu lang, maximal {{characters}} Zeichen`,
    tooShort: `Zu kurz, mindestens {{characters}} Zeichen`,
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

export type OrganizationFormProps = {
  organizationForm: OrganizationFormType,
  onChange: (organizationForm: OrganizationFormType, shouldUpdate: boolean) => void,
  className?: string,
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
                                   className,
                                 }: PropsForTranslation<OrganizationFormTranslation, OrganizationFormProps>) => {
  const translation = useTranslation([defaultOrganizationFormTranslations], overwriteTranslation)
  const validators = useTranslatedValidators()
  const { shortName, longName, contactEmail } = organizationForm.organization

  const minShortNameLength = 2
  const minLongNameLength = 4
  const maxShortNameLength = 16
  const maxLongNameLength = 64
  const maxMailLength = 320

  const shortNameError = validators.notEmpty(shortName) ?? validators.length(shortName, [minShortNameLength, maxShortNameLength])
  const longNameError = validators.notEmpty(longName) ?? validators.length(longName, [minLongNameLength, maxLongNameLength])
  const emailError = validators.notEmpty(contactEmail) ?? validators.email(contactEmail) ?? validators.length(contactEmail, [undefined, maxMailLength])

  function triggerOnChange(newOrganization: OrganizationMinimalDTO, shouldUpdate: boolean, touched: OrganizationFormTouchedType) {
    const isValid = !!shortNameError && !!longNameError && !!emailError
    onChange({ hasChanges: true, isValid, organization: newOrganization, touched }, shouldUpdate && isValid) // this might lead to confusing behaviour where changes aren't saved on invalid input
  }

  return (
    <div className={clsx('col gap-y-6', className)}>
      <ColumnTitle title={translation('general')} type="subtitle"/>
      <LoadingAndErrorComponent
        isLoading={!organizationForm}
        className="min-h-69"
      >
        <FormElementWrapper
          id="shortName"
          error={shortNameError}
          description={translation('shortNameDescription')}
          label={translation('shortName')}
          required={true}
          isShowingError={organizationForm.touched.shortName}
        >
          {({ setIsShowingError: _, isShowingError: _2, ...bag }) => (
            <Input
              {...bag}
              value={organizationForm.organization.shortName}
              onBlur={() => triggerOnChange({ ...organizationForm.organization }, false, {
                ...organizationForm.touched,
                shortName: true
              })}
              onChangeText={text => {
                triggerOnChange({
                  ...organizationForm.organization,
                  shortName: text
                }, false, { ...organizationForm.touched })
              }}
              onEditCompleted={text => triggerOnChange({
                ...organizationForm.organization,
                shortName: text
              }, true, { ...organizationForm.touched, shortName: true })}
              maxLength={maxShortNameLength}
            />
          )}
        </FormElementWrapper>
        <FormElementWrapper
          id="longName"
          error={longNameError}
          description={translation('longNameDescription')}
          label={translation('longName')}
          required={true}
          isShowingError={organizationForm.touched.longName}
        >
          {({ setIsShowingError: _, isShowingError: _2, ...bag }) => (
            <Input
              {...bag}
              value={longName}
              onBlur={() => triggerOnChange({ ...organizationForm.organization }, false, {
                ...organizationForm.touched,
                longName: true
              })}
              onChangeText={text => {
                triggerOnChange({
                  ...organizationForm.organization,
                  longName: text
                }, false, { ...organizationForm.touched })
              }}
              onEditCompleted={text => triggerOnChange({
                ...organizationForm.organization,
                longName: text
              }, true, { ...organizationForm.touched, longName: true })}
              maxLength={maxLongNameLength}
            />
          )}
        </FormElementWrapper>
        <FormElementWrapper
          id="email"
          error={emailError}
          description={translation('contactEmailDescription')}
          label={translation('contactEmail')}
          required={true}
          isShowingError={organizationForm.touched.email}
        >
          {({ setIsShowingError: _, isShowingError: _2, ...bag }) => (
            <Input
              {...bag}
              value={organizationForm.organization.contactEmail}
              type="email"
              onBlur={() => triggerOnChange({ ...organizationForm.organization }, false, {
                ...organizationForm.touched,
                email: true
              })}
              onChangeText={text => {
                triggerOnChange({
                  ...organizationForm.organization,
                  contactEmail: text
                }, false, { ...organizationForm.touched })
              }}
              onEditCompleted={text => triggerOnChange({
                ...organizationForm.organization,
                contactEmail: text
              }, true, { ...organizationForm.touched, email: true })}
              maxLength={maxMailLength}
            />
          )}
        </FormElementWrapper>
      </LoadingAndErrorComponent>
    </div>
  )
}
