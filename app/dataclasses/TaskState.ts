export const TaskState = {
  unscheduled: { textID: 'unscheduled', colorLabel: 'hw-label-1' },
  inProgress: { textID: 'inProgress', colorLabel: 'hw-label-2' },
  done: { textID: 'done', colorLabel: 'hw-label-3' },
} as const

export type TaskStateInformation = { textID: string, colorLabel: string }
