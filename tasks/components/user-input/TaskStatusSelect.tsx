import { Select, type SelectProps } from '@helpwave/common/components/user-input/Select'
import { useTranslation, type PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { TaskStatus } from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'

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

type TaskStatusSelectProps = Omit<SelectProps<TaskStatus>, 'options'> & {
  /**
   * All entries within this array will be removed as options
   */
  removeOptions?: TaskStatus[]
}

/**
 * A component for selecting a TaskStatus
 *
 * The state is managed by the parent
 */
export const TaskStatusSelect = ({
  language,
  removeOptions = [],
  value,
  ...selectProps
}: PropsWithLanguage<TaskStatusSelectTranslation, TaskStatusSelectProps>) => {
  const translation = useTranslation(language, defaultTaskStatusSelectTranslation)
  const defaultOptions = [
    { value: TaskStatus.TASK_STATUS_TODO, label: translation.unscheduled },
    { value: TaskStatus.TASK_STATUS_IN_PROGRESS, label: translation.inProgress },
    { value: TaskStatus.TASK_STATUS_DONE, label: translation.done }
  ]

  const filteredOptions = defaultOptions.filter(defaultValue => !removeOptions?.find(value2 => value2 === defaultValue.value))
  if (removeOptions?.find(value2 => value2 === value)) {
    console.error(`The selected value ${value} cannot be in the remove list`)
    value = filteredOptions.length > 0 ? filteredOptions[0]!.value : undefined
    console.warn(`Overwriting with ${value} instead`)
  }

  return (
    <Select
      value={value}
      options={filteredOptions}
      {...selectProps}
    />
  )
}
