import { Select, type SelectProps } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import type { TaskStatus } from '@helpwave/api-services/types/tasks/task'

type TaskStatusSelectTranslation = {
  unscheduled: string,
  inProgress: string,
  done: string,
  status: string,
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
  removeOptions?: TaskStatus[],
}

/**
 * A component for selecting a TaskStatus
 *
 * The state is managed by the parent
 */
export const TaskStatusSelect = ({
  overwriteTranslation,
  removeOptions = [],
  value,
  ...selectProps
}: PropsForTranslation<TaskStatusSelectTranslation, TaskStatusSelectProps>) => {
  const translation = useTranslation(defaultTaskStatusSelectTranslation, overwriteTranslation)
  const defaultOptions: { value: TaskStatus, label: string }[] = [
    { value: 'todo', label: translation.unscheduled },
    { value: 'inProgress', label: translation.inProgress },
    { value: 'done', label: translation.done }
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
