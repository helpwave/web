import { Select, SelectOption, type SelectProps } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'

type TaskVisibilitySelectTranslation = {
  private: string,
  public: string,
}

const defaultTaskVisibilitySelectTranslation = {
  en: {
    private: 'private',
    public: 'public',
  },
  de: {
    private: 'privat',
    public: 'öffentlich',
  }
}

type TaskVisibilitySelectProps = Omit<SelectProps, 'children' | 'onValueChanged' | 'value'> & {
  value?: boolean,
  onValueChanged?: (isVisible: boolean) => void,
}

/**
 * A component for selecting a TaskVisibility
 *
 * The state is managed by the parent
 */
export const TaskVisibilitySelect = ({
  overwriteTranslation,
  value,
  onValueChanged,
  ...selectProps
}: PropsForTranslation<TaskVisibilitySelectTranslation, TaskVisibilitySelectProps>) => {
  const translation = useTranslation([defaultTaskVisibilitySelectTranslation], overwriteTranslation)
  const options = [
    { value: 'public', label: translation('public') },
    { value: 'private', label: translation('private') },
  ]

  return (
    <Select
      {...selectProps}
      value={value ? 'public' : 'private'}
      onValueChanged={(value: string) => onValueChanged?.(value === 'public')}
      buttonProps={{
        ...selectProps.buttonProps,
        selectedDisplay: (value: string) => {
          const option = options.find(option => option.value === value)
          if(option) {
            return option.label
          }
          return '-'
        },
      }}
    >
      {options.map((option, index) => (
        <SelectOption key={index} value={option.value}>
          {option.label}
        </SelectOption>
      ))}
    </Select>
  )
}
