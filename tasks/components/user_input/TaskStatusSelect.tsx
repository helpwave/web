import type { TaskStatus } from '../../mutations/room_mutations'
import { Select } from '@helpwave/common/components/user_input/Select'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'

type TaskStatusSelectTranslation = {
  unscheduled: string,
  inProgress: string,
  done: string,
  status: string
}

const defaultTaskStatusSelectTranslation = {
  en: {
    unscheduled: 'unscheduled',
    inProgress: 'in progress',
    done: 'done',
    status: 'status'
  },
  de: {
    unscheduled: 'nicht angefangen',
    inProgress: 'in Arbeit',
    done: 'fertig',
    status: 'Status'
  }
}

type TaskStatusSelectProps = {
  value: TaskStatus | undefined,
  onChange: (status: TaskStatus) => void
}

export const TaskStatusSelect = ({
  language,
  value,
  onChange
}: PropsWithLanguage<TaskStatusSelectTranslation, TaskStatusSelectProps>) => {
  const translation = useTranslation(language, defaultTaskStatusSelectTranslation)
  return (
    <Select
      value={value}
      options={[
        { value: 'unscheduled', label: translation.unscheduled },
        { value: 'inProgress', label: translation.inProgress },
        { value: 'done', label: translation.done }
      ]}
      onChange={onChange}
    />
  )
}
