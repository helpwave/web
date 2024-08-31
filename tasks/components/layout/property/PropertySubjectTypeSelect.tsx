import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { SelectProps } from '@helpwave/common/components/user-input/Select'
import { Select } from '@helpwave/common/components/user-input/Select'
import type { SubjectType } from '@/components/layout/property/properties'
import { subjectTypeList } from '@/components/layout/property/properties'

type PropertySubjectTypeSelectTranslation = {[key in SubjectType]: string}

const defaultPropertySubjectTypeSelectTranslation: Record<Languages, PropertySubjectTypeSelectTranslation> = {
  en: {
    organization: 'Organization',
    ward: 'Ward',
    room: 'Room',
    bed: 'Bed',
    patient: 'Patient',
  },
  de: {
    organization: 'Organisation',
    ward: 'Station',
    room: 'Raum',
    bed: 'Bett',
    patient: 'Patient',
  }
}

/**
 * A Select for the Property SubjectType
 */
export const PropertySubjectTypeSelect = ({
  overwriteTranslation,
  ...props
}: PropsForTranslation<PropertySubjectTypeSelectTranslation, Omit<SelectProps<SubjectType>, 'options'>>) => {
  const translation = useTranslation(defaultPropertySubjectTypeSelectTranslation, overwriteTranslation)
  return (
    <Select
      {...props}
      options={subjectTypeList.map(subjectType => ({
        value: subjectType,
        label: translation[subjectType]
      }))}
    />
  )
}
