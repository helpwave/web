import { Select } from '@helpwave/common/components/user_input/Select'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'

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

/**
 * A component for selecting a TaskStatus
 *
 * The state is managed by the parent
 */
export const TaskVisibilitySelect = ({
  language,
  value,
  ...selectProps
}: PropsWithLanguage<TaskVisibilitySelectTranslation>) => {
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
