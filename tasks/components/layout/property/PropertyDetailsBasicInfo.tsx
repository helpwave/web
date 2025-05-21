import type { Languages } from '@helpwave/hightide'
import type { PropsForTranslation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import type { InputGroupProps } from '@helpwave/hightide'
import { InputGroup } from '@helpwave/hightide'
import { Input } from '@helpwave/hightide'
import { Textarea } from '@helpwave/hightide'
import type { Property } from '@helpwave/api-services/types/properties/property'
import { PropertySubjectTypeSelect } from '@/components/layout/property/PropertySubjectTypeSelect'

type PropertyBasicInfo = Pick<Property, 'name' | 'description' | 'subjectType'>

type PropertyDetailsBasicInfoTranslation = {
  basicInfo: string,
  subjectType: string,
  propertyName: string,
  description: string,
  writeYourDescription: string,
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
  inputGroupProps?: Omit<InputGroupProps, 'title'>,
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
        value={value.name}
        onChange={name => onChange({ ...value, name })}
        onEditCompleted={name => onEditComplete({ ...value, name })}
      />
      <Textarea
        label={{ name: translation.description, labelType: 'labelMedium' }}
        value={value.description}
        placeholder={translation.writeYourDescription}
        onChange={description => onChange({ ...value, description })}
        onEditCompleted={description => onEditComplete({ ...value, description })}
      />
    </InputGroup>
  )
}
