import { Select, type SelectProps } from '@helpwave/common/components/user-input/Select'
import { useTranslation, type PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'

type TaskVisibilitySelectTranslation = {
  private: string,
  public: string
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
  language,
  value,
  ...selectProps
}: PropsWithLanguage<TaskVisibilitySelectTranslation, TaskVisibilitySelectProps>) => {
  const translation = useTranslation(language, defaultTaskVisibilitySelectTranslation)
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
