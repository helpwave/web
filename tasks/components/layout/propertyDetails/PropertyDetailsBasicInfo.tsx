import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { InputGroup } from '@helpwave/common/components/InputGroup'
import { Select } from '@helpwave/common/components/user-input/Select'
import { Input } from '@helpwave/common/components/user-input/Input'
import { Textarea } from '@helpwave/common/components/user-input/Textarea'

type PropertyDetailsBasicInfoTranslation = {
  basicInfo: string,
  subjectType: string,
  organization: string,
  ward: string,
  room: string,
  bed: string,
  patient: string,
  propertyName: string,
  description: string,
  writeYourDescription: string
}

const defaultPropertyDetailsBasicInfoTranslation: Record<Languages, PropertyDetailsBasicInfoTranslation> = {
  en: {
    basicInfo: 'Basic Information',
    subjectType: 'Subject Type',
    organization: 'Organization',
    ward: 'Ward',
    room: 'Room',
    bed: 'Bed',
    patient: 'Patient',
    propertyName: 'Property Name',
    description: 'Description',
    writeYourDescription: 'Description text here'
  },
  de: {
    basicInfo: 'Basis Informationen',
    subjectType: 'Subjekt Typ',
    organization: 'Organisation',
    ward: 'Station',
    room: 'Raum',
    bed: 'Bett',
    patient: 'Patient',
    propertyName: 'Name der Eigenschaft',
    description: 'Beschreibung',
    writeYourDescription: 'Beschreibung Text hier'
  }
}

const subjectTypeList = ['organization', 'ward', 'room', 'bed', 'patient'] as const
type SubjectType = typeof subjectTypeList[number]

export type PropertyDetailsBasicInfoType = {
  subjectType: SubjectType,
  propertyName: string, // TODO reconsider this
  description: string
}

export type PropertyDetailsBasicInfoProps = {
  value: PropertyDetailsBasicInfoType,
  onChange: (value: PropertyDetailsBasicInfoType) => void
}

/**
 * The Layout for the PropertyDetails basic information input
 */
export const PropertyDetailsBasicInfo = ({
  language,
  value,
  onChange
}: PropsWithLanguage<PropertyDetailsBasicInfoTranslation, PropertyDetailsBasicInfoProps>) => {
  const translation = useTranslation(language, defaultPropertyDetailsBasicInfoTranslation)
  return (
    <InputGroup title={translation.basicInfo}>
      <Select
        // TODO add icons
        value={value.subjectType}
        label={{ name: translation.subjectType, labelType: 'labelMedium' }}
        options={subjectTypeList.map(subjectType => ({ value: subjectType, label: translation[subjectType] }))}
        onChange={subjectType => onChange({ ...value, subjectType })}
      />
      <Input
        label={{ name: translation.propertyName, labelType: 'labelMedium' }}
        value={value.propertyName}
        onChange={propertyName => onChange({ ...value, propertyName })}
      />
      <Textarea
        label={{ name: translation.description, labelType: 'labelMedium' }}
        value={value.description}
        placeholder={translation.writeYourDescription}
        onChange={description => onChange({ ...value, description })}
      />
    </InputGroup>
  )
}
