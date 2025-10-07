import type { ExpandableProps, PropsForTranslation, Translation } from '@helpwave/hightide'
import { ExpandableUncontrolled, FormElementWrapper, Input, Textarea, useTranslation } from '@helpwave/hightide'
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

const defaultPropertyDetailsBasicInfoTranslation: Translation<PropertyDetailsBasicInfoTranslation> = {
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
  expandableProps?: Omit<ExpandableProps, 'label'>,
}

/**
 * The Layout for the PropertyDetails basic information input
 */
export const PropertyDetailsBasicInfo = ({
                                           overwriteTranslation,
                                           value,
                                           onChange,
                                           onEditComplete,
                                           expandableProps,
                                         }: PropsForTranslation<PropertyDetailsBasicInfoTranslation, PropertyDetailsBasicInfoProps>) => {
  const translation = useTranslation([defaultPropertyDetailsBasicInfoTranslation], overwriteTranslation)
  return (
    <ExpandableUncontrolled
      {...expandableProps}
      label={(
        <h4 className="typography-title-md">
          {translation('basicInfo')}
        </h4>
      )}
      contentClassName="pb-4"
      contentExpandedClassName="max-h-128"
    >
      <FormElementWrapper
        required={true}
        disabled={false}
        label={translation('subjectType')}
      >
        {(bag) => (
          <PropertySubjectTypeSelect
            value={value.subjectType}
            onValueChanged={subjectType => {
              const newValue = { ...value, subjectType }
              onChange(newValue)
              onEditComplete(newValue)
            }}
            buttonProps={bag}
          />
        )}
      </FormElementWrapper>
      <FormElementWrapper
        required={true}
        disabled={false}
        label={translation('propertyName')}
      >
        {bag => (
          <Input
            value={value.name}
            onChangeText={name => onChange({ ...value, name })}
            onEditCompleted={name => onEditComplete({ ...value, name })}
            className="w-full"
            {...bag}
          />
        )}
      </FormElementWrapper>
      <FormElementWrapper
        required={true}
        disabled={false}
        label={translation('description')}
      >
        {bag => (
          <Textarea
            value={value.description}
            placeholder={translation('writeYourDescription')}
            onChangeText={description => onChange({ ...value, description })}
            onEditCompleted={description => onEditComplete({ ...value, description })}
            {...bag}
          />
        )}
      </FormElementWrapper>
    </ExpandableUncontrolled>
  )
}
