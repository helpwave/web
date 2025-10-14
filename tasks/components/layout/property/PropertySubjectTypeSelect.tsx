import { SelectOption } from '@helpwave/hightide'
import type { PropsForTranslation , Translation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import type { SelectProps } from '@helpwave/hightide'
import { Select } from '@helpwave/hightide'
import type { PropertySubjectType } from '@helpwave/api-services/types/properties/property'
import { subjectTypeList } from '@helpwave/api-services/types/properties/property'

type PropertySubjectTypeSelectTranslation = { [key in PropertySubjectType]: string }

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

type PropertySubjectTypeSelectProps = Omit<SelectProps, 'children' | 'onValueChanged'> & {
  onValueChanged: (value: PropertySubjectType) => void,
}

/**
 * A Select for the Property SubjectType
 */
export const PropertySubjectTypeSelect = ({
  overwriteTranslation,
  ...props
}: PropsForTranslation<PropertySubjectTypeSelectTranslation, PropertySubjectTypeSelectProps>) => {
  const translation = useTranslation([defaultPropertySubjectTypeSelectTranslation], overwriteTranslation)
  return (
    <Select
      {...props}
      onValueChanged={(value) => props.onValueChanged(value as PropertySubjectType)}
      buttonProps={{
        ...props?.buttonProps,
        selectedDisplay: (value) => translation(value as PropertySubjectType),
      }}
    >
      {subjectTypeList.map(subjectType =>(
        <SelectOption key={subjectType} value={subjectType}>
          {translation(subjectType)}
        </SelectOption>
      ))}
    </Select>
  )
}
