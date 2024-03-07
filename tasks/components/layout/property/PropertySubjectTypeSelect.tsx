import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { SelectProps } from '@helpwave/common/components/user-input/Select'
import { Select } from '@helpwave/common/components/user-input/Select'
import type { SubjectType } from '@/components/layout/property/property'
import { subjectTypeList } from '@/components/layout/property/property'

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
  language,
  ...props
}: PropsWithLanguage<PropertySubjectTypeSelectTranslation, Omit<SelectProps<SubjectType>, 'options'>>) => {
  const translation = useTranslation(language, defaultPropertySubjectTypeSelectTranslation)
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
