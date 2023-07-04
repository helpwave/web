export type TaskStatus = 'unscheduled' | 'inProgress' | 'done'

export type SubTaskDTO = {
  name: string,
  isDone: boolean
}

export type TaskDTO = {
  id: string,
  name: string,
  assignee: string,
  notes: string,
  status: TaskStatus,
  subtasks: SubTaskDTO[],
  dueDate: Date,
  creationDate?: Date,
  isPublicVisible: boolean
}
