import { useState } from 'react'
import clsx from 'clsx'
import type { Translation } from '@helpwave/hightide'
import { Input, type PropsForTranslation, useTranslation } from '@helpwave/hightide'

type WardFormTranslation = {
  general: string,
  name: string,
  nameDescription: string,
  required: string,
  tooLong: string,
  tooShort: string,
  duplicateName: string,
}

const defaultWardFormTranslations: Translation<WardFormTranslation> = {
  en: {
    general: 'General',
    name: 'Name',
    nameDescription: 'Should be short, prefer abbreviations.',
    required: 'Required Field, cannot be empty',
    tooLong: `Too long, at most {{characters}} characters`,
    tooShort: `Too short, at least {{characters}} characters`,
    duplicateName: 'Wards can\'t have the same name'
  },
  de: {
    general: 'Allgemeines',
    name: 'Name',
    nameDescription: 'Sollte kurz sein, Abbkürzungen werden präferiert.',
    required: 'Benötigter Wert, darf nicht leer sein',
    tooLong: `Zu lang, maximal {{characters}} Zeichen`,
    tooShort: `Zu kurz, mindestens {{characters}} Zeichen`,
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
  const translation = useTranslation([defaultWardFormTranslations], overwriteTranslation)
  const [touched, setTouched] = useState({ name: isShowingErrorsDirectly })

  const minWardNameLength = 2
  const maxWardNameLength = 32

  const inputErrorClasses = 'border-negative focus:border-negative focus:ring-negative border-2'
  const inputClasses = 'mt-1 block rounded-md w-full'

  function validateName(ward: WardFormInfoDTO) {
    const wardName = ward.name.trim()
    if (wardName === '') {
      return translation('required')    } else if (wardName.length < minWardNameLength) {
      return translation('tooShort', { replacements: { characters: minWardNameLength.toString() } })
    } else if (wardName.length > maxWardNameLength) {
      return translation('tooLong', { replacements: { characters: maxWardNameLength.toString() } })
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
      <div className="mt-2 mb-1">
        <Input
          id="name" value={ward.name} label={{ name: translation('name') }}
          onBlur={() => setTouched({ ...touched, name: true })}
          onChangeText={text => triggerOnChange({ ...ward, name: text })}
          maxLength={maxWardNameLength}
          className={clsx(inputClasses, { [inputErrorClasses]: isDisplayingShortNameError })}
        />
        {isDisplayingShortNameError && <span className="textstyle-form-error">{nameErrorMessage}</span>}
      </div>
      <span className="textstyle-form-description">{translation('nameDescription')}</span>
    </form>
  )
}
