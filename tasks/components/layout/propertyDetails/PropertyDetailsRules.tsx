import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { InputGroup } from '@helpwave/common/components/InputGroup'
import { Select } from '@helpwave/common/components/user-input/Select'
import { Tile } from '@helpwave/common/components/layout/Tile'
import { Checkbox } from '@helpwave/common/components/user-input/Checkbox'
import { tw } from '@helpwave/common/twind'

type PropertyDetailsRulesTranslation = {
  rules: string,
  importance: string,
  optional: string,
  softRequired: string,
  alwaysVisible: string,
  alwaysVisibleDescription: string
}

const defaultPropertyDetailsRulesTranslation: Record<Languages, PropertyDetailsRulesTranslation> = {
  en: {
    rules: 'Rules',
    importance: 'Importance',
    optional: 'Optional',
    softRequired: 'Soft-Required',
    alwaysVisible: 'Always Visible',
    alwaysVisibleDescription: 'Will be displayed on entity even if the value of the property is empty',
  },
  de: {
    rules: 'Regeln',
    importance: 'Wichtigkeit',
    optional: 'Optional',
    softRequired: 'Soft-Required', // TODO better translation
    alwaysVisible: 'Immer sichtbar',
    alwaysVisibleDescription: 'Wird auf der Entität angezeigt selbst wenn der Wert nicht gesezt wurde',
  }
}

const importanceList = ['optional', 'softRequired'] as const
type ImportanceType = typeof importanceList[number]

export type PropertyDetailsRulesType = {
  importance: ImportanceType,
  isAlwaysVisible: boolean
}

export type PropertyDetailsRulesProps = {
  value: PropertyDetailsRulesType,
  onChange: (value: PropertyDetailsRulesType) => void
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
      <Select
        // TODO add icons
        value={value.importance}
        label={{ name: translation.importance, labelType: 'labelMedium' }}
        options={importanceList.map(importance => ({ value: importance, label: translation[importance] }))}
        onChange={importance => onChange({ ...value, importance })}
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
