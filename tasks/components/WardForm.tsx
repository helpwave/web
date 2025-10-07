import type { Translation } from '@helpwave/hightide'
import {
  FormElementWrapper,
  Input,
  type PropsForTranslation,
  useTranslatedValidators,
  useTranslation
} from '@helpwave/hightide'
import { useState } from 'react'

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
  const validators = useTranslatedValidators()
  const [touched, setTouched] = useState({ name: isShowingErrorsDirectly })

  const minWardNameLength = 2
  const maxWardNameLength = 32

  function validateName(ward: WardFormInfoDTO) {
    return validators.notEmpty(ward.name) ?? validators.length(ward.name, [minWardNameLength, maxWardNameLength])
  }

  const error = validateName(ward)

  function triggerOnChange(newWard: WardFormInfoDTO) {
    const isValid = validateName(newWard) === undefined
    onChange(newWard, isValid)
  }

  return (
    <FormElementWrapper
      id="name"
      label={translation('name')}
      error={error}
      errorProps={{ className: '!static' }}
      isShowingError={touched.name}
    >
      {({ setIsShowingError: _, isShowingError: _2, ...bag }) => (
        <Input
          {...bag}
          type="text"
          value={ward.name}
          onChangeText={text => {
            triggerOnChange({ ...ward, name: text })
            setTouched(prev => ({ ...prev, name: true }))
          }}
          maxLength={maxWardNameLength}
        />
      )}
    </FormElementWrapper>
  )
}
