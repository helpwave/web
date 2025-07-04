import { Expandable } from '@helpwave/hightide'
import type { PropsForTranslation , ExpandableProps, Translation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import { Tile } from '@helpwave/hightide'
import { Checkbox } from '@helpwave/hightide'
import type { Property } from '@helpwave/api-services/types/properties/property'

type PropertyDetailsRulesTranslation = {
  rules: string,
  importance: string,
  importanceDescription: string,
  alwaysVisible: string,
  alwaysVisibleDescription: string,
}

const defaultPropertyDetailsRulesTranslation: Translation<PropertyDetailsRulesTranslation> = {
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
  inputGroupProps?: Omit<ExpandableProps, 'label'>,
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
    <Expandable {...inputGroupProps} label={translation.rules}>
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
            size="medium"
          />
        )}
        className="mt-4"
      />
    </Expandable>
  )
}
