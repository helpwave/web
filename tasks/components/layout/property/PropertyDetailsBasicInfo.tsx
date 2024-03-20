import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { InputGroupProps } from '@helpwave/common/components/InputGroup'
import { InputGroup } from '@helpwave/common/components/InputGroup'
import { Input } from '@helpwave/common/components/user-input/Input'
import { Textarea } from '@helpwave/common/components/user-input/Textarea'
import type { PropertyBasicInfo } from '@/components/layout/property/property'
import { PropertySubjectTypeSelect } from '@/components/layout/property/PropertySubjectTypeSelect'

type PropertyDetailsBasicInfoTranslation = {
  basicInfo: string,
  subjectType: string,
  propertyName: string,
  description: string,
  writeYourDescription: string
}

const defaultPropertyDetailsBasicInfoTranslation: Record<Languages, PropertyDetailsBasicInfoTranslation> = {
  en: {
    basicInfo: 'Basic Information',
    subjectType: 'Subject Type',
    propertyName: 'Property Name',
    description: 'Description',
    writeYourDescription: 'Description text here'
  },
  de: {
    basicInfo: 'Basis Informationen',
    subjectType: 'Subjekt Typ',
    propertyName: 'Name der Eigenschaft',
    description: 'Beschreibung',
    writeYourDescription: 'Beschreibung Text hier'
  }
}

export type PropertyDetailsBasicInfoProps = {
  value: PropertyBasicInfo,
  onChange: (value: PropertyBasicInfo) => void,
  onEditComplete: (value: PropertyBasicInfo) => void,
  inputGroupProps?: Omit<InputGroupProps, 'title'>
}

/**
 * The Layout for the PropertyDetails basic information input
 */
export const PropertyDetailsBasicInfo = ({
  overwriteTranslation,
  value,
  onChange,
  onEditComplete,
  inputGroupProps = {},
}: PropsForTranslation<PropertyDetailsBasicInfoTranslation, PropertyDetailsBasicInfoProps>) => {
  const translation = useTranslation(defaultPropertyDetailsBasicInfoTranslation, overwriteTranslation)
  return (
    <InputGroup {...inputGroupProps} title={translation.basicInfo}>
      <PropertySubjectTypeSelect
        // TODO add icons
        value={value.subjectType}
        label={{ name: translation.subjectType, labelType: 'labelMedium' }}
        onChange={subjectType => {
          const newValue = { ...value, subjectType }
          onChange(newValue)
          onEditComplete(newValue)
        }}
      />
      <Input
        label={{ name: translation.propertyName, labelType: 'labelMedium' }}
        value={value.propertyName}
        onChange={propertyName => onChange({ ...value, propertyName })}
        onEditCompleted={propertyName => onEditComplete({ ...value, propertyName })}
      />
      <Textarea
        label={{ name: translation.description, labelType: 'labelMedium' }}
        value={value.description}
        placeholder={translation.writeYourDescription}
        onChange={description => onChange({ ...value, description })}
        onEditCompleted={description => onChange({ ...value, description })}
      />
    </InputGroup>
  )
}
