import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { InputGroupProps } from '@helpwave/common/components/InputGroup'
import { InputGroup } from '@helpwave/common/components/InputGroup'
import { Tile } from '@helpwave/common/components/layout/Tile'
import { Checkbox } from '@helpwave/common/components/user-input/Checkbox'
import { tw } from '@helpwave/common/twind'
import type { Property } from '@helpwave/api-services/types/properties/property'

type PropertyDetailsRulesTranslation = {
  rules: string,
  importance: string,
  importanceDescription: string,
  alwaysVisible: string,
  alwaysVisibleDescription: string
}

const defaultPropertyDetailsRulesTranslation: Record<Languages, PropertyDetailsRulesTranslation> = {
  en: {
    rules: 'Rules',
    importance: 'Importance',
    importanceDescription: 'The properties gets visually highlighted on an entity if it is empty.',
    alwaysVisible: 'Always Visible',
    alwaysVisibleDescription: 'Will be displayed on entity even if the value of the properties is empty',
  },
  de: {
    rules: 'Regeln',
    importance: 'Wichtigkeit',
    importanceDescription: 'Die Eigenschaft wird auf einer Entität visuell hervorgehoben wenn sie nicht ausgefüllt ist.',
    alwaysVisible: 'Immer sichtbar',
    alwaysVisibleDescription: 'Wird auf der Entität angezeigt selbst wenn der Wert nicht gesezt wurde',
  }
}

type PropertyRules = Pick<Property, 'alwaysIncludeForViewSource'>

export type PropertyDetailsRulesProps = {
  value: PropertyRules,
  onChange: (value: PropertyRules) => void,
  onEditComplete: (value: PropertyRules) => void,
  inputGroupProps?: Omit<InputGroupProps, 'title'>
}

/**
 * The Layout for the PropertyDetails basic information input
 */
export const PropertyDetailsRules = ({
  overwriteTranslation,
  value,
  onChange,
  onEditComplete,
  inputGroupProps
}: PropsForTranslation<PropertyDetailsRulesTranslation, PropertyDetailsRulesProps>) => {
  const translation = useTranslation(defaultPropertyDetailsRulesTranslation, overwriteTranslation)
  return (
    <InputGroup {...inputGroupProps} title={translation.rules}>
      <Tile
        title={{ value: translation.alwaysVisible, className: 'textstyle-label-md' }}
        description={{ value: translation.alwaysVisibleDescription }}
        suffix={(
          <Checkbox
            checked={value.alwaysIncludeForViewSource ?? false}
            onChange={alwaysIncludeForViewSource => {
              const newValue: PropertyRules = { ...value, alwaysIncludeForViewSource }
              onChange(newValue)
              onEditComplete(newValue)
            }}
            size={20}
          />
        )}
        className={tw('mt-4')}
      />
    </InputGroup>
  )
}
