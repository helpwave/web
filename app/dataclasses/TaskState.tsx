export const TaskState: { [key in 'unscheduled' | 'inProgress' | 'done']: TaskStateInformation } = {
  unscheduled: { text: 'unscheduled', label: 1 },
  inProgress: { text: 'in progress', label: 2 },
  done: { text: 'done', label: 3 },
}

export type TaskStateInformation = { text: string, label: number }
