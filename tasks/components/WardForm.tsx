import { useState } from 'react'
import clsx from 'clsx'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Input } from '@helpwave/common/components/user-input/Input'

type WardFormTranslation = {
  general: string,
  name: string,
  nameDescription: string,
  required: string,
  tooLong: (maxCharacters: number) => string,
  tooShort: (minCharacters: number) => string,
  duplicateName: string,
}

const defaultWardFormTranslations: Record<Languages, WardFormTranslation> = {
  en: {
    general: 'General',
    name: 'Name',
    nameDescription: 'Should be short, prefer abbreviations.',
    required: 'Required Field, cannot be empty',
    tooLong: (maxCharacters) => `Too long, at most ${maxCharacters} characters`,
    tooShort: (minCharacters) => `Too short, at least ${minCharacters} characters`,
    duplicateName: 'Wards can\'t have the same name'
  },
  de: {
    general: 'Allgemeines',
    name: 'Name',
    nameDescription: 'Sollte kurz sein, Abbkürzungen werden präferiert.',
    required: 'Benötigter Wert, darf nicht leer sein',
    tooLong: (maxCharacters) => `Zu lang, maximal ${maxCharacters} Zeichen`,
    tooShort: (minCharacters) => `Zu kurz, mindestens ${minCharacters} Zeichen`,
    duplicateName: 'Stationen müssen unterschiedliche Namen haben'
  }
}

type WardFormInfoDTO = {
  name: string,
}

export type WardFormProps = {
  ward: WardFormInfoDTO,
  onChange: (organization: WardFormInfoDTO, isValid: boolean) => void,
  isShowingErrorsDirectly?: boolean,
}

/**
 * A form for editing the information of a Ward
 */
export const WardForm = ({
  overwriteTranslation,
  ward,
  onChange = () => undefined,
  isShowingErrorsDirectly = false
}: PropsForTranslation<WardFormTranslation, WardFormProps>) => {
  const translation = useTranslation(defaultWardFormTranslations, overwriteTranslation)
  const [touched, setTouched] = useState({ name: isShowingErrorsDirectly })

  const minWardNameLength = 2
  const maxWardNameLength = 32

  const inputErrorClasses = clsx('border-hw-negative-500 focus:border-hw-negative-500 focus:ring-hw-negative-500 border-2')
  const inputClasses = clsx('mt-1 block rounded-md w-full border-gray-300 shadow-sm focus:outline-none focus:border-hw-primary-500 focus:ring-hw-primary-500')

  function validateName(ward: WardFormInfoDTO) {
    const wardName = ward.name.trim()
    if (wardName === '') {
      return translation.required
    } else if (wardName.length < minWardNameLength) {
      return translation.tooShort(minWardNameLength)
    } else if (wardName.length > maxWardNameLength) {
      return translation.tooLong(maxWardNameLength)
    }
  }

  function triggerOnChange(newWard: WardFormInfoDTO) {
    const isValid = validateName(newWard) === undefined
    onChange(newWard, isValid)
  }

  const nameErrorMessage: string | undefined = validateName(ward)

  const isDisplayingShortNameError = nameErrorMessage && touched.name

  return (
    <form>
      <div className={clsx('mt-2 mb-1')}>
        <Input id="name" value={ward.name} label={{ name: translation.name }}
               onBlur={() => setTouched({ ...touched, name: true })}
               onChange={text => triggerOnChange({ ...ward, name: text })}
               maxLength={maxWardNameLength}
               className={clsx(inputClasses, { [inputErrorClasses]: isDisplayingShortNameError })}
        />
        {isDisplayingShortNameError && <span className={clsx('textstyle-form-error')}>{nameErrorMessage}</span>}
      </div>
      <span className={clsx('textstyle-form-description')}>{translation.nameDescription}</span>
    </form>
  )
}
