import { Select, type SelectProps } from '@helpwave/hightide/components/user-input/Select'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide/hooks/useTranslation'

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

type TaskVisibilitySelectProps = Omit<SelectProps<boolean>, 'options'>

/**
 * A component for selecting a TaskVisibility
 *
 * The state is managed by the parent
 */
export const TaskVisibilitySelect = ({
  overwriteTranslation,
  value,
  ...selectProps
}: PropsForTranslation<TaskVisibilitySelectTranslation, TaskVisibilitySelectProps>) => {
  const translation = useTranslation(defaultTaskVisibilitySelectTranslation, overwriteTranslation)
  const options = [
    { value: true, label: translation.public },
    { value: false, label: translation.private },
  ]

  return (
    <Select
      value={value}
      options={options}
      {...selectProps}
    />
  )
}
