import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { InputGroup } from '@helpwave/common/components/InputGroup'
import { Tile } from '@helpwave/common/components/layout/Tile'
import { Checkbox } from '@helpwave/common/components/user-input/Checkbox'
import { tw } from '@helpwave/common/twind'
import type { ImportanceType, PropertyRules } from '@/components/layout/property/property'

type PropertyDetailsRulesTranslation = {
  rules: string,
  importance: string,
  importanceDescription: string,
  alwaysVisible: string,
  alwaysVisibleDescription: string
} & {[key in ImportanceType]: string}

const defaultPropertyDetailsRulesTranslation: Record<Languages, PropertyDetailsRulesTranslation> = {
  en: {
    rules: 'Rules',
    importance: 'Importance',
    importanceDescription: 'The property gets visually highlighted on an entity if it is empty.',
    optional: 'Optional',
    softRequired: 'Soft-Required',
    alwaysVisible: 'Always Visible',
    alwaysVisibleDescription: 'Will be displayed on entity even if the value of the property is empty',
  },
  de: {
    rules: 'Regeln',
    importance: 'Wichtigkeit',
    importanceDescription: 'Die Eigenschaft wird auf einer Entität visuell hervorgehoben wenn sie nicht ausgefüllt ist.',
    optional: 'Optional',
    softRequired: 'Soft-Required', // TODO better translation
    alwaysVisible: 'Immer sichtbar',
    alwaysVisibleDescription: 'Wird auf der Entität angezeigt selbst wenn der Wert nicht gesezt wurde',
  }
}

export type PropertyDetailsRulesProps = {
  value: PropertyRules,
  onChange: (value: PropertyRules) => void
}

/**
 * The Layout for the PropertyDetails basic information input
 */
export const PropertyDetailsRules = ({
  language,
  value,
  onChange
}: PropsWithLanguage<PropertyDetailsRulesTranslation, PropertyDetailsRulesProps>) => {
  const translation = useTranslation(language, defaultPropertyDetailsRulesTranslation)
  return (
    <InputGroup title={translation.rules}>
      <Tile
        title={{ value: translation.softRequired, type: 'labelMedium' }}
        description={{ value: translation.importanceDescription }}
        suffix={(
          <Checkbox
            checked={value.importance === 'softRequired'}
            onChange={isAlwaysVisible => onChange({ ...value, importance: isAlwaysVisible ? 'softRequired' : 'optional' })}
            size={20}
          />
        )}
      />
      <Tile
        title={{ value: translation.alwaysVisible, type: 'labelMedium' }}
        description={{ value: translation.alwaysVisibleDescription }}
        suffix={(
          <Checkbox
            checked={value.isAlwaysVisible}
            onChange={isAlwaysVisible => onChange({ ...value, isAlwaysVisible })}
            size={20}
          />
        )}
        className={tw('mt-4')}
      />
    </InputGroup>
  )
}
