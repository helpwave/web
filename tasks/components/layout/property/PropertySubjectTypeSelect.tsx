import type { Translation } from '@helpwave/hightide'
import type { PropsForTranslation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import type { SelectProps } from '@helpwave/hightide'
import { Select } from '@helpwave/hightide'
import type { SubjectType } from '@helpwave/api-services/types/properties/property'
import { subjectTypeList } from '@helpwave/api-services/types/properties/property'

type PropertySubjectTypeSelectTranslation = { [key in SubjectType]: string }

const defaultPropertySubjectTypeSelectTranslation: Translation<PropertySubjectTypeSelectTranslation> = {
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
