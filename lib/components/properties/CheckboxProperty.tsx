import { Check } from 'lucide-react'
import { noop } from '../../util/noop'
import { Checkbox } from '../user-input/Checkbox'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsForTranslation } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'

type CheckboxPropertyTranslation = {
  yes: string,
  no: string,
}

const defaultCheckboxPropertyTranslation: Record<Languages, CheckboxPropertyTranslation> = {
  en: {
    yes: 'Yes',
    no: 'No'
  },
  de: {
    yes: 'Ja',
    no: 'Nein'
  }
}

export type CheckboxPropertyProps = Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue' | 'onRemove'> & {
  value?: boolean,
  onChange?: (value: boolean) => void,
}

/**
 * An Input for a boolen properties
 */
export const CheckboxProperty = ({
                                   overwriteTranslation,
                                   value,
                                   onChange = noop,
                                   readOnly,
                                   ...baseProps
                                 }: PropsForTranslation<CheckboxPropertyTranslation, CheckboxPropertyProps>) => {
  const translation = useTranslation(defaultCheckboxPropertyTranslation, overwriteTranslation)

  return (
    <PropertyBase
      {...baseProps}
      hasValue={true}
      readOnly={readOnly}
      icon={<Check size={16}/>}
      input={() => (
        <div className="row py-2 px-4 items-center">
          <Checkbox
            // TODO make bigger as in #904
            checked={value ?? true}
            disabled={readOnly}
            onChange={onChange}
            label={{ name: `${translation.yes}/${translation.no}`, labelType: 'labelMedium' }}
          />
        </div>
      )}
    />
  )
}
