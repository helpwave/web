import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { SelectProps } from '@helpwave/common/components/user-input/Select'
import { Select } from '@helpwave/common/components/user-input/Select'
import type { SubjectType } from '@helpwave/api-services/types/properties/property'
import { subjectTypeList } from '@helpwave/api-services/types/properties/property'

type PropertySubjectTypeSelectTranslation = {[key in SubjectType]: string}

const defaultPropertySubjectTypeSelectTranslation: Record<Languages, PropertySubjectTypeSelectTranslation> = {
  en: {
    patient: 'Patient',
    task: 'Task',
  },
  de: {
    patient: 'Patient',
    task: 'Task',
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
