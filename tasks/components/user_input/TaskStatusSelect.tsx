import type { SelectProps } from '@helpwave/common/components/user_input/Select'
import { Select } from '@helpwave/common/components/user_input/Select'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { GetPatientDetailsResponse } from '@helpwave/proto-ts/proto/services/task_svc/v1/patient_svc_pb'
import TaskStatus = GetPatientDetailsResponse.TaskStatus;

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

type TaskStatusSelectProps = Omit<SelectProps<TaskStatus>, 'options'>

/**
 * A component for selecting a TaskStatus
 *
 * The state is managed by the parent
 */
export const TaskStatusSelect = ({
  language,
  ...selectProps
}: PropsWithLanguage<TaskStatusSelectTranslation, TaskStatusSelectProps>) => {
  const translation = useTranslation(language, defaultTaskStatusSelectTranslation)
  return (
    <Select
      options={[
        { value: TaskStatus.TASK_STATUS_TODO, label: translation.unscheduled },
        { value: TaskStatus.TASK_STATUS_IN_PROGRESS, label: translation.inProgress },
        { value: TaskStatus.TASK_STATUS_DONE, label: translation.done }
      ]}
      {...selectProps}
    />
  )
}
