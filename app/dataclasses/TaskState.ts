export const TaskState = {
  unscheduled: { text: 'unscheduled', colorLabel: 'hw-label-1' },
  inProgress: { text: 'in progress', colorLabel: 'hw-label-2' },
  done: { text: 'done', colorLabel: 'hw-label-3' },
} as const

export type TaskStateInformation = { text: string, colorLabel: string }
